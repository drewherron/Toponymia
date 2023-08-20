import * as mapboxgl from 'mapbox-gl';
import { createApp } from 'vue';
import axios from 'axios';
class MapApp {
    private map: any;
    private mapContainer: HTMLElement;
    private randomBtn: HTMLElement;
    private sidebar: HTMLElement;
    private articleTab: HTMLElement;
    private articleContent: HTMLElement;
    private talkTab: HTMLElement;
    private talkContent: HTMLElement;
    private historyTab: HTMLElement;
    private historyContent: HTMLElement;
    private closeTab: HTMLElement;
    private addMarkerMode: boolean = false;
    private markerToggle: HTMLElement;
    private newArticleDiv: HTMLElement;
    private articleTitle: HTMLCollectionOf<Element>;
    private articleCoordinates: HTMLCollectionOf<Element>;
    private nameField: HTMLInputElement;
    private titleField: HTMLInputElement;
    private coordField: HTMLInputElement;
    private longField: HTMLInputElement;
    private latField: HTMLInputElement;
    private tpnmIdField: HTMLInputElement;
    private idField: HTMLInputElement;
    private mapboxIdField: HTMLInputElement;
    private placeClassField: HTMLInputElement;
    private placeTypeField: HTMLInputElement;
    private geoTypeField: HTMLInputElement;
    private iso_3166_1Field: HTMLInputElement;
    private iso_3166_2Field: HTMLInputElement;
    private geojson: any;
    private articleIdList: string[] = [];
    private markerHeight: number = 50;
    private markerRadius: number = 10;
    private linearOffset: number = 25;
    private articleIdList: string[];
    private username: string | null;
    private vueApp: any;


    constructor() {
        this.mapContainer = document.getElementById("map") as HTMLElement;
        this.randomBtn = document.getElementById('random-btn') as HTMLElement;
        this.sidebar = document.getElementById('sidebar') as HTMLElement;
        this.articleTab = document.getElementById("article-tab") as HTMLElement;
        this.articleContent = document.getElementById("article-content") as HTMLElement;
        this.talkTab = document.getElementById("talk-tab") as HTMLElement;
        this.talkContent = document.getElementById("talk-content") as HTMLElement;
        this.historyTab = document.getElementById("history-tab") as HTMLElement;
        this.historyContent = document.getElementById("history-content") as HTMLElement;
        this.closeTab = document.getElementById("close-tab") as HTMLElement;
        this.markerToggle = document.getElementById("marker-toggle") as HTMLElement;
        this.newArticleDiv = document.getElementById("new-article") as HTMLElement;
        this.articleTitle = document.getElementsByClassName("article-title");
        this.articleCoordinates = document.getElementsByClassName("article-coordinates");
        this.nameField = document.getElementById("na-name") as HTMLInputElement;
        this.titleField = document.getElementById("na-title") as HTMLInputElement;
        this.coordField = document.getElementById("na-coord") as HTMLInputElement;
        this.longField = document.getElementById("na-long") as HTMLInputElement;
        this.latField = document.getElementById("na-lat") as HTMLInputElement;
        this.tpnmIdField = document.getElementById("na-tpnm-id") as HTMLInputElement;
        this.idField = document.getElementById("na-id") as HTMLInputElement;
        this.mapboxIdField = document.getElementById("na-mapbox-id") as HTMLInputElement;
        this.placeClassField = document.getElementById("na-place-class") as HTMLInputElement;
        this.placeTypeField = document.getElementById("na-place-type") as HTMLInputElement;
        this.geoTypeField = document.getElementById("na-geo-type") as HTMLInputElement;
        this.iso_3166_1Field = document.getElementById("na-iso-3166-1") as HTMLInputElement;
        this.iso_3166_2Field = document.getElementById("na-iso-3166-2") as HTMLInputElement;
        // TODO figure out sending Django data to TS

        this.vueApp = createApp({
            data() {
                return {
                    names: [],
                    selected: ''
                };
            },
            delimiters: ["[[","]]"]
        }).mount('#app');


    }

    init() {
        mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2, 20],
            zoom: 1.5
        });
        this.map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        }));
        this.map.addControl(new mapboxgl.NavigationControl());
    }

    openSidebar() {
        const windowWidth = window.outerWidth;
        this.sidebar.style.width = "800px";
        this.sidebar.style.maxWidth = `${windowWidth}px`;
        this.mapContainer.style.marginLeft = "20%";
    }

    closeSidebar() {
        this.sidebar.style.width = "0";
        this.mapContainer.style.marginLeft = "0";
    }
        
    markerToggleOn(): boolean {
        this.markerToggle.innerHTML = 'Cancel';
        this.markerToggle.style.borderStyle = 'inset';
        this.markerToggle.style.backgroundColor = '#f99a89';
        this.addMarkerMode = true;
        return this.addMarkerMode;
    }

    markerToggleOff(): boolean {
        this.markerToggle.innerHTML = 'Add Marker';
        this.markerToggle.style.borderStyle = 'outset';
        this.markerToggle.style.backgroundColor = 'lightgray';
        this.addMarkerMode = false;
        return this.addMarkerMode;
    }

    cancelMarker(marker: any): void {
        marker.remove();
        this.closeSidebar();
    }

    addTabListeners(): void {
        this.articleTab.addEventListener("click", this.listentime.bind(this));
        this.talkTab.addEventListener("click", this.listentime.bind(this));
        if (this.isAuthenticated) {
            this.editTab?.addEventListener("click", this.listentime.bind(this));
        }
        this.historyTab.addEventListener("click", this.listentime.bind(this));
    }

    removeTabListeners(): void {
        this.articleTab.removeEventListener("click", this.listentime.bind(this));
        this.talkTab.removeEventListener("click", this.listentime.bind(this));
        if (this.isAuthenticated) {
            this.editTab?.removeEventListener("click", this.listentime.bind(this));
        }
        this.historyTab.removeEventListener("click", this.listentime.bind(this));
    }

    listentime(): void {
        this.openTab(this.innerText);
    }

    openTab(thisTab: string): void {
        let tablinks = document.getElementsByClassName("tablink");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].style.backgroundColor = '#555';
            tablinks[i].style.color = 'white';
        }
        let activeTab = document.getElementById(thisTab.toLowerCase() + "-tab");
        activeTab!.style.backgroundColor = 'white';
        activeTab!.style.color = 'black';

        let sidebarContent = document.getElementsByClassName("sidebar-content");
        for (let i = 0; i < sidebarContent.length; i++) {
            sidebarContent[i].style.display = "none";
        }
        let activeContent = document.getElementById(thisTab.toLowerCase());
        activeContent!.style.display = 'block';
        activeContent!.style.height = '100%';

        if (document.getElementById("edit")!.style.display == 'block') {
            document.getElementById("new-article")!.style.display = 'none';
            document.getElementById("new-name")!.style.display = 'none';
            document.getElementById("dropdown")!.style.display = 'flex';
            document.getElementById("new-edit")!.style.display = 'none';
        }
    }

    formatDateTime(DTinput: string): string {
        let date = new Date(DTinput);
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth() + 1;
        let day = date.getUTCDate();
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        let seconds = date.getUTCSeconds();
        let UTCDateTime = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' UTC';
        return UTCDateTime;
    }
    openArticle(tpnm_id: string, csrf_token: string, app_tpnm_get_article_url: string) {
        this.addTabListeners();
        this.closeTab.onclick = this.closeSidebar.bind(this);

        if (this.username) {
            document.getElementById("new-article")!.style.display = 'none';
            document.getElementById("new-name")!.style.display = 'none';
            document.getElementById("dropdown")!.style.display = 'flex';
            document.getElementById("new-edit")!.style.display = 'none';
            document.getElementById("add-name-btn")!.addEventListener("click", () => this.addName(tpnm_id));
            document.getElementById("close-tab")!.innerText = "Close";
        }

        this.openTab("article");

        let data = {
            tpnm_id: tpnm_id
        }
        let config = {
            headers: {
                'X-CSRFToken': csrf_token
            }
        }
        axios.post(app_tpnm_get_article_url, data, config).then((response) => {
            let jsondata = response.data;
            let article_id = jsondata['properties'][0]['id'];
            let tpnmId = jsondata['properties'][0]['tpnm_id'];
            let title = jsondata['properties'][0]['title'];
            let coordinates = jsondata['properties'][0]['coordinates'];
            let content = jsondata['properties'][0]['toponyms'][0]['edits'][0]['content'];
            let activeContent = document.getElementById("article");
            activeContent!.style.display = 'block';
            activeContent!.style.height = '100%';

            for (let i = 0; i < this.articleTitle.length; i++) {
                this.articleTitle[i].innerText = title;
            }
            for (let i = 0; i < this.articleCoordinates.length; i++) {
                this.articleCoordinates[i].innerText = '(' + coordinates.toString() + ')';
            }
            this.coordField.value = coordinates.join(',');

            this.vueApp.names = jsondata['properties'][0]['toponyms'];

            if (this.username) {
                document.getElementById("edit-tab")!.innerText = "Edit";
                document.getElementById("nn-article-id")!.value = article_id;
                document.getElementById("nn-tpnm-id")!.value = tpnmId;
                document.getElementById("ne-tpnm-id")!.value = tpnmId;
                document.getElementById("ne-content")!.value = content;
                document.getElementById("add-name-btn")!.addEventListener("click", () => this.addName(tpnm_id));
            }
        });

        this.openSidebar();
    }

    initEventListeners() {
        if (this.username) {
            this.markerToggle.addEventListener('click', () => {
                if (this.markerToggle.innerHTML == 'Add Marker') {
                    this.markerToggleOn();
                } else {
                    this.markerToggleOff();
                }
            });
        }

        this.randomBtn.addEventListener('click', () => {
            const randomArticle = this.articleIdList[Math.floor(Math.random() * this.articleIdList.length)];
            this.openArticle(randomArticle);
        });

        this.map.on('click', (e: any) => { 
            const features = this.map.queryRenderedFeatures(e.point);
            document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
            const jsonfeatures = this.map.queryRenderedFeatures(e.point);
        });
    }

    private fetchArticles(): void {

        const articles = [];

        articles.forEach(article => {
            this.geojson.features.push({
                geometry: {
                    coordinates: [article.longitude, article.latitude]
                },
                properties: {
                    title: article.title,
                    tpnm_id: article.tpnm_id
                }
            });

            this.articleIdList.push(article.tpnm_id);
        });

        this.addMarkersToMap();
    }

    private addMarkersToMap(): void {
        this.geojson.features.forEach(marker => {
            const markerDiv = document.createElement('div');
            markerDiv.className = 'marker';
            new mapboxgl.Marker(markerDiv, {
                offset: [8, -18]
            })
            .setLngLat(marker.geometry.coordinates)
            .addTo(this.map);

            const currentMarkerId = marker.properties.tpnm_id;
            markerDiv.setAttribute('id', currentMarkerId);
            const currentMarker = document.getElementById(currentMarkerId);
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.innerText = marker.properties.title;
            currentMarker?.appendChild(tooltip);

            currentMarker?.addEventListener('click', () => {
                this.openArticle(currentMarkerId);
            });
        });
    }
}