import "./style.css";
import { chain, maybe, web } from "@aminnairi/prelude"

const networkElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/network.png"))
  .and(web.attribute.set("alt", "Network"))
  .and(web.attribute.set("width", "16px"))
  .and(web.attribute.set("height", "16px"))
  .link();

const batteryIconElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/battery-full.svg"))
  .and(web.attribute.set("alt", "Battery"))
  .and(web.attribute.set("width", "16px"))
  .and(web.attribute.set("height", "16px"))
  .link();

const batteryTextElement = chain
  .of(document)
  .and(web.createElement("span"))
  .and(web.property.textContent.set("80%"))
  .link();

const batteryElement = chain
  .of(document)
  .and(web.createElement("div"))
  .and(web.attribute.set("style", "display: flex; flex-direction: row: justify-content: center; align-items: center;"))
  .and(web.appendChild(batteryIconElement))
  .and(web.appendChild(batteryTextElement))
  .link();

const vibrationElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/vibration.svg"))
  .and(web.attribute.set("alt", "Vibration"))
  .and(web.attribute.set("width", "16px"))
  .and(web.attribute.set("height", "16px"))
  .link();

const now = new Date();
const date = now.toLocaleDateString("fr-FR");
const time = now.toLocaleTimeString("fr-FR");

const dateElement = chain
  .of(document)
  .and(web.createElement("div"))
  .and(web.property.textContent.set(`${date} ${time}`))
  .and(web.attribute.set("style", "flex: 1; display: flex; justify-content: center; alignItems: center"))
  .link();

const headerElement = chain
  .of(document)
  .and(web.createElement("div"))
  .and(web.attribute.set("style", "height: 20px; display: flex; flex-direction: row; gap: 5px; justify-content: center; align-items: center; padding: 5px;"))
  .and(web.appendChild(networkElement))
  .and(web.appendChild(dateElement))
  .and(web.appendChild(vibrationElement))
  .and(web.appendChild(batteryElement))
  .link();

const calculatorAppElement = chain
  .of(document)
  .and(web.createElement("div"))
  .and(web.property.textContent.set("TODO: calculator"))
  .and(web.attribute.set("style", "position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: white; display: flex; justify-content: center; align-items: center;"))
  .and(web.on("click", () => {
    chain
      .of(document.body)
      .and(web.removeChild(applicationsElement))
  }))
  .link();

const calculatorAppIconElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/calculator.svg"))
  .and(web.attribute.set("alt", "Vibration"))
  .and(web.attribute.set("width", "100%"))
  .and(web.attribute.set("height", "100%"))
  .and(web.on("click", () => {
    chain
      .of(applicationsElement)
      .and(web.appendChild(calculatorAppElement));
  }))
  .link();

const notesAppIconElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/notes.svg"))
  .and(web.attribute.set("alt", "Vibration"))
  .and(web.attribute.set("width", "100%"))
  .and(web.attribute.set("height", "100%"))
  .link();

const clockAppIconElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/clock.svg"))
  .and(web.attribute.set("alt", "Vibration"))
  .and(web.attribute.set("width", "100%"))
  .and(web.attribute.set("height", "100%"))
  .link();

const applicationsElement = chain
  .of(document)
  .and(web.createElement("div"))
  .and(web.attribute.set("style", "flex: 1; position: relative; padding: 10px; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(8, 1fr); gap: 10px; align-items: end;"))
  .and(web.appendChild(calculatorAppIconElement))
  .and(web.appendChild(notesAppIconElement))
  .and(web.appendChild(clockAppIconElement))
  .link();

const navigationBackElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/back.svg"))
  .and(web.attribute.set("alt", "Back"))
  .and(web.attribute.set("width", "100%"))
  .and(web.attribute.set("height", "100%"))
  .link();

const navigationHomeElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/home.svg"))
  .and(web.attribute.set("alt", "Home"))
  .and(web.attribute.set("width", "100%"))
  .and(web.attribute.set("height", "100%"))
  .link();

const navigationRecentElement = chain
  .of(document)
  .and(web.createElement("img"))
  .and(web.attribute.set("src", "/recent.svg"))
  .and(web.attribute.set("alt", "Recent"))
  .and(web.attribute.set("width", "100%"))
  .and(web.attribute.set("height", "100%"))
  .link();

chain
  .of(navigationBackElement)
  .and(web.on("click", () => {
    chain
      .of(applicationsElement)
      .and(web.removeChild(calculatorAppElement))
  }))

const navigationElement = chain
  .of(document)
  .and(web.createElement("div"))
  .and(web.attribute.set("style", "height: 40px; width: 100%; display: flex; flex-direction: row; justify-content: space-around; align-items: center;"))
  .and(web.appendChild(navigationBackElement))
  .and(web.appendChild(navigationHomeElement))
  .and(web.appendChild(navigationRecentElement))
  .link();

const rootElement = chain
  .of(web.getElementById("app"))
  .and(maybe.and(web.attribute.set("style", "display: flex; flex-direction: column; height: 100vh; justify-content: stretch; align-items: stretch;")))
  .and(maybe.and(web.appendChild(headerElement)))
  .and(maybe.and(web.appendChild(applicationsElement)))
  .and(maybe.and(web.appendChild(navigationElement)))
  .link();

if (!rootElement.or(null)) {
  throw new Error("Root element not found");
}

