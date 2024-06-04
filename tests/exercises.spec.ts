import { test, expect,chromium } from '@playwright/test';

test('Amazon redirect to login/signup page', async ({ page }) => {
  await page.goto('https://www.amazon.ca/');

  await page.locator('#nav-orders').click()
  await expect(page).toHaveTitle('Amazon Sign In')
  await page.goto('https://www.amazon.ca/');
  await page.locator('#nav-link-accountList').click()
  await expect(page).toHaveTitle('Amazon Sign In')

});



test('Amazon changing currency', async ({ page }) => {

  await page.goto('https://www.amazon.com/');

  await page.locator('#icp-touch-link-cop').click()

  await page.locator('.a-dropdown-container .a-button').click()
  const currencies = await page.locator('.a-list-link .a-dropdown-item')
  await currencies.filter({hasText:"CAD"}).click()
  await page.locator('input[type="submit"][ aria-labelledby="icp-save-button-announce"]').click()
  await page.locator('#nav-xshop a', {hasText:"Today's Deals"}).click()
  await page.getByTestId("product-card").first().click()
  expect(await page.locator('#centerCol .a-price-symbol').first().textContent()).toEqual('CAD')
})

test('Ikea Adding to Cart', async({page}) => {

  await page.goto('https://www.ikea.com/ca/en/')
  
  await page.locator('.hnf-carousel-slide a').first().click()

  await page.getByRole('listbox').locator('a').first().click()

  await page.getByText('Shop all SALE').click()

  await page.getByTestId('plp-product-card').locator('a').first().click()

  await page.locator('button',{hasText:"Add to cart"}).first().click()
 
 expect(await page.getByRole('dialog').locator('.rec-inline-message__body').textContent()).toEqual('Added to cart ')

})

test('Sony, Selecting Stories', async({page}) => {

  const Categories = {
    "Product":"Product",
    "UI / UX": "UI/UX",
    "Communication": "Communication",
    "Interviews":"Interviews",
    "Perspectives":"Perspectives"
  }
  await page.goto('https://www.sony.com/en/SonyInfo/design/stories/#all')
  const CategoryList = await page.locator('.tag-link')
  
  for (const Category in Categories){
    await CategoryList.filter({hasText:Category}).click()
    const ArticleList = await page.locator(".pdt-index .active")
    console.log(await ArticleList.count())
    
    for (let i = 0; i < await ArticleList.count(); i++){
      const tags = await ArticleList.nth(i).locator('.category-tag-link').allTextContents()
      expect(tags).toContain(Categories[Category])
      
    }

  }

})

test.describe("Android Device comparison", () => {
  test.beforeEach(async({page}) => {
    await page.goto('https://androidenterprisepartners.withgoogle.com/devices/')

  })
  test('Verify if user can compare 2 devices', async({page}) => {
    await page.getByRole('button',{name:"CLOSE"}).click()
    await page.locator('.glue-cookie-notification-bar').getByRole('button',{name:"Agree"}).click()
    const deviceList = await page.locator(".results__card")
    const deviceOne = await deviceList.first().locator('h2').textContent()
    const deviceTwo = await deviceList.nth(1).locator('h2').textContent()
    await deviceList.first().getByRole('checkbox').check()
    await deviceList.nth(1).getByRole('checkbox').check()

    await page.locator('.compare-picker').getByText("COMPARE").click()
    expect(await page.locator('.compare-header__title').textContent()).toEqual("Comparing Devices")
    const cellOne = await page.locator('.compare-content__cell h2').nth(0).textContent()
    const cellTwo = await page.locator('.compare-content__cell h2').nth(1).textContent()
    expect(cellOne?.trim()).toEqual(deviceOne?.trim())
    expect(cellTwo?.trim()).toEqual(deviceTwo?.trim())
  })

  test('Verify if user can compare 3 devices', async({page}) => {
    await page.getByRole('button',{name:"CLOSE"}).click()
    await page.locator('.glue-cookie-notification-bar').getByRole('button',{name:"Agree"}).click()
    const deviceList = await page.locator(".results__card")
    const deviceOne = await deviceList.first().locator('h2').textContent()
    const deviceTwo = await deviceList.nth(1).locator('h2').textContent()
    const deviceThree = await deviceList.nth(2).locator('h2').textContent()
    await deviceList.first().getByRole('checkbox').check()
    await deviceList.nth(1).getByRole('checkbox').check()
    await deviceList.nth(2).getByRole('checkbox').check()

    await page.locator('.compare-picker').getByText("COMPARE").click()
    expect(await page.locator('.compare-header__title').textContent()).toEqual("Comparing Devices")
    const cellOne = await page.locator('.compare-content__cell h2').nth(0).textContent()
    const cellTwo = await page.locator('.compare-content__cell h2').nth(1).textContent()
    const cellThree = await page.locator('.compare-content__cell h2').nth(2).textContent()
    expect(cellOne?.trim()).toEqual(deviceOne?.trim())
    expect(cellTwo?.trim()).toEqual(deviceTwo?.trim())
    expect(cellThree?.trim()).toEqual(deviceThree?.trim())
  })

})


test.describe("Wikipedia Tests", () => {

  test.beforeEach(async({page}) => {
    await page.goto('https://www.wikipedia.org/')
  })

  test("Search For a Term", async({page}) => {
    const searchBar = await page.locator("#searchInput")
    await searchBar.click()
    await searchBar.fill("Playstation 4")
    await page.locator('#search-form button.pure-button').click()
    expect(await page.locator("#firstHeading").textContent()).toEqual("PlayStation 4")
  })

  test('Validate Search', async({page}) => {
    const searchBar = await page.locator("#searchInput")
    await searchBar.click()
    await searchBar.fill("Playstation 4")
    expect(await page.locator(".suggestion-title").first().textContent()).toEqual("PlayStation 4")
    await page.locator('.suggestion-link').first().click()
    expect(await page.locator("#firstHeading").textContent()).toEqual("PlayStation 4")
    await expect(page.locator('nav#mw-panel-toc')).toBeVisible()
  })

  test('Validate Locale change', async({page}) =>{
    await page.locator('#js-link-box-es').click()
    const url = page.url()
    expect(url).toContain("es.wikipedia.org")
  })

})


test('Calling Pokemon API', async({page, request}) => {

  const response =  await request.get('https://pokeapi.co/api/v2/pokemon/')

  const responseBody = JSON.parse(await response.text())

  const randomPokemon = [responseBody.results[Math.floor(Math.random()*responseBody.results.length)],responseBody.results[Math.floor(Math.random()*responseBody.results.length)],responseBody.results[Math.floor(Math.random()*responseBody.results.length)]]
  let pokemonList: any[] = [];
  for (let i = 0; i < randomPokemon.length; i++){
    let response2 = await request.get(randomPokemon[i].url)
    let responseBody2 = JSON.parse(await response2.text())
    let Name = responseBody2.name
    let abilities: string[] = [];
    for (let i = 0; i < responseBody2.abilities.length; i++){
      abilities.push(responseBody2.abilities[i].ability.name)
    }
    const result = {
      Name: Name,
      Abilities: abilities
    }
    pokemonList.push(result)
    console.log(result)
  }
    const browser = await chromium.launch();

    const page2 = await browser.newPage();
    
    await page2.setContent(`<!DOCTYPE html>${JSON.stringify(pokemonList)}`)    
    await page2.screenshot({ path: 'example.png' });
    
    await browser.close();
  


})

