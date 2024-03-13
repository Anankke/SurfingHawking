// ==UserScript==
// @name         SurfingHawking
// @namespace    Anankke
// @match        *://*/*
// @version      0.0.1
// @grant        none
// @run-at       document-start
// @author       github.com @Anankke
// @icon         https://www.google.com/s2/favicons?sz=48&domain=cloudflare.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=cloudflare.com
// @description  Automatically handle Cloudflare CAPTCHA challenges for seamless browsing experience
// ==/UserScript==

async function waitForElement (selector, timeout = 30000, interval = 200) {
  return new Promise((resolve) => {
    const startTime = Date.now()
    const checkElement = () => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
      } else if (Date.now() - startTime < timeout) {
        setTimeout(checkElement, interval)
      } else {
        resolve(null)
      }
    }
    checkElement()
  })
}

async function clickElement (selector) {
  const element = await waitForElement(selector)
  if (element && typeof element.click === 'function') {
    element.click()
    return true
  }
  return false
}

async function verifyYouAreHuman () {
  const rayId = document.querySelector('div.ray-id')
  const herfDOM = document.querySelector(
    'a[href*=\'cloudflare.com\'][target=\'_blank\']')
  if (rayId && herfDOM) {
    await clickElement('input[value=\'Verify you are human\'][type=\'button\']')
    return
  }

  if (window.location.host === 'challenges.cloudflare.com' &&
    document.querySelector('#success') && document.querySelector('#fail') &&
    document.querySelector('#expired')) {
    await clickElement('input[type=\'checkbox\']')
    await clickElement('span.mark')
    return
  }

  if (document.querySelector('div.logo')) {
    await clickElement('input[value=\'Verify you are human\'][type=\'button\']')
  }
}

document.addEventListener('DOMContentLoaded', verifyYouAreHuman)
