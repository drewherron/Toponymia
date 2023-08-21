import { createApp } from 'vue';
import {Tabs, Tab} from 'vue-tabs-component';
import { MapApp } from './mapApp';

const app = createApp({
});

// Vue component registration
app.component('tabs', Tabs);
app.component('tab', Tab);

function openPage(pageName: string, elmnt: HTMLElement, color: string): void {
  // Hide all elements with class="tabcontent" by default
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    (tabcontent[i] as HTMLElement).style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  let tablinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tablinks.length; i++) {
    (tablinks[i] as HTMLElement).style.backgroundColor = "";
}


  // Show the specific tab content
  document.getElementById(pageName)!.style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen")!.click();

// MapApp initialization
const mapApp = new MapApp();
mapApp.init();
mapApp.initAuthenticatedFeatures();