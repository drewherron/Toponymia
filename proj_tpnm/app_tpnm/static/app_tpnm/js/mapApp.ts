import * as mapboxgl from 'mapbox-gl';
import { createApp } from 'vue';
import axios from 'axios';

export class MapApp {
    private map: any;
    private mapContainer: HTMLElement;
    private csrfToken: string;
    private articleUrl: string;
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
    private username: string | null;
    private vueApp: any;


    constructor() {
        this.mapContainer = document.getElementById("map") as HTMLElement;
        this.csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content;
        this.articleUrl = (document.querySelector('meta[name="article-url"]') as HTMLMetaElement).content;        
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
        const bodyData = document.body.dataset;
        this.username = bodyData.username && bodyData.username !== 'null' ? bodyData.username : null;

        this.vueApp = createApp({
            data() {
                return {
                    names: [],
                    selected: ''
                };
            },
            delimiters: ["[[","]]"]
        }).mount('#app');

        this.geojson = {
            type: 'FeatureCollection',
            features: []
        };

        this.fetchArticles();
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
        if (this.username) {
            this.editTab?.addEventListener("click", this.listentime.bind(this));
        }
        this.historyTab.addEventListener("click", this.listentime.bind(this));
    }

    removeTabListeners(): void {
        this.articleTab.removeEventListener("click", this.listentime.bind(this));
        this.talkTab.removeEventListener("click", this.listentime.bind(this));
        if (this.username) {
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
            (tablinks[i] as HTMLElement).style.backgroundColor = '#555';
            (tablinks[i] as HTMLElement).style.color = 'white';
        }
        let activeTab = document.getElementById(thisTab.toLowerCase() + "-tab");
        activeTab!.style.backgroundColor = 'white';
        activeTab!.style.color = 'black';

        let sidebarContent = document.getElementsByClassName("sidebar-content");
        for (let i = 0; i < sidebarContent.length; i++) {
            (sidebarContent[i] as HTMLElement).style.display = "none";
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

    newArticlePoint?(title: string, coordinates: string[], mapboxId: string): void;
    addName?(tpnm_id: string): void;
    addEdit?(article_id: string): void;

    initAuthenticatedFeatures() {
        if (!this.username) return;

        this.newArticlePoint = (title: string, coordinates: string[], mapboxId: string) => {
            this.removeTabListeners();
            this.articleTab.style.backgroundColor = '#555';
            this.articleTab.style.color = '#737070';
            this.talkTab.style.backgroundColor = '#555';
            this.talkTab.style.color = '#737070';
            this.historyTab.style.backgroundColor = '#555';
            this.historyTab.style.color = '#737070';
            let newArticleTab = document.getElementById("edit-tab") as HTMLElement;
            newArticleTab.style.backgroundColor = 'white';
            newArticleTab.style.color = 'black';
            newArticleTab.innerText = 'New';
            this.closeTab.innerText = 'Cancel';
            this.closeTab.style.color = 'white';
            this.newArticleDiv.style.display = 'block';
            document.getElementById("new-name").style.display = 'none';
            document.getElementById("new-edit").style.display = 'none';
            document.getElementById("dropdown").style.display = 'flex';
            let sidebarContent = this.sidebar.getElementsByClassName("sidebar-content");
            for (let i = 0; i < sidebarContent.length; i++) {
                sidebarContent[i].style.display = "none";
            }
            let activeContent = document.getElementById("edit");
            activeContent!.style.display = 'block';
            activeContent!.style.height = '100%';
            for (let i = 0; i < this.articleTitle.length; i++) {
                (this.articleTitle[i] as HTMLElement).innerText = title;
            }
            for (let i = 0; i < this.articleCoordinates.length; i++) {
                (this.articleCoordinates[i] as HTMLElement).innerText = '(' + coordinates.toString() + ')';
            }

            this.coordField.value = coordinates.join(',');
            $('.inlang-multiselect').val(null).trigger('change');
            $('.fromlang-multiselect').val(null).trigger('change');
            document.getElementById("na-content")!.value = '';
            document.getElementById("na-reference")!.value = '';
            this.openSidebar();
            this.markerToggleOff();
        };

        this.addName = (tpnm_id: string) => {
            document.getElementById("new-article")!.style.display = 'none';
            document.getElementById("new-name")!.style.display = 'block';
            document.getElementById("dropdown")!.style.display = 'none';
            document.getElementById("new-edit")!.style.display = 'none';
            document.getElementById("nn-name")!.value = '';
            document.getElementById("nn-content")!.value = '';
            document.getElementById("nn-reference")!.value = '';
            document.getElementById("nn-tpnm-id")!.value = tpnm_id;
            $('.nn-inlang-multiselect').val(null).trigger('change');
            $('.nn-fromlang-multiselect').val(null).trigger('change');
            this.newArticleDiv.style.display = 'none';
        };

        this.addEdit = (article_id: string) => {
            document.getElementById("new-article")!.style.display = 'none';
            document.getElementById("new-name")!.style.display = 'none';
            document.getElementById("dropdown")!.style.display = 'flex';
            document.getElementById("new-edit")!.style.display = 'block';
            this.newArticleDiv.style.display = 'none';
        };
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
                (this.articleTitle[i] as HTMLElement).innerText = title;
            }
            for (let i = 0; i < this.articleCoordinates.length; i++) {
                (this.articleCoordinates[i] as HTMLElement).innerText = '(' + coordinates.toString() + ')';
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
            this.openArticle(randomArticle, this.csrfToken, this.articleUrl);
        });

        this.map.on('click', (e: any) => { 
            const features = this.map.queryRenderedFeatures(e.point);
            document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
            const jsonfeatures = this.map.queryRenderedFeatures(e.point);
        });
    }

    initMapClickEvent() {
        if (!this.username) return;

        this.map.on('click', (e: any) => {
            if (this.addMarkerMode) {
                const markerDiv = document.createElement('div');
                markerDiv.className = 'marker';
                const jsonfeatures = this.map.queryRenderedFeatures(e.point);
                const geoType = jsonfeatures[0]["geometry"]["type"];
                const coordinates = jsonfeatures[0]["geometry"]["coordinates"];
                const longitude = coordinates[0];
                const latitude = coordinates[1];
                const nameEn = jsonfeatures[0]["properties"]["name_en"];
                const name = jsonfeatures[0]["properties"]["name"];
                const placeType = jsonfeatures[0]["properties"]["type"];
                const placeClass = jsonfeatures[0]["properties"]["class"];
                const mapboxId = jsonfeatures[0]["id"];
                const iso_3166_1 = jsonfeatures[0]["properties"]["iso_3166_1"];
                const iso_3166_2 = jsonfeatures[0]["properties"]["iso_3166_2"];
                // ... (similar assignments for other fields)

                const tpnmId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36) + mapboxId.toString();

                let title: string;
                if (nameEn || name) {
                    if (nameEn) {
                        title = nameEn !== name ? `${nameEn} (${name})` : nameEn;
                    } else {
                        title = name;
                    }
                }

                const named_id = `${title} (${mapboxId.toString()})`;

                if (geoType === "Point" && title) {
                    this.articleTitle.innerText = title;
                    this.newArticlePoint(title, coordinates, mapboxId);
                    const marker = new mapboxgl.Marker(markerDiv, {
                        offset: [9, -18]
                    }).setLngLat(coordinates).addTo(this.map);

                    this.map.flyTo({
                        center: coordinates
                    });

                    markerDiv.setAttribute('id', tpnmId);
                    const currentMarker = document.getElementById(tpnmId);
                    const tooltip = document.createElement('span');
                    tooltip.className = 'tooltip';
                    tooltip.innerText = title;
                    currentMarker?.appendChild(tooltip);

                    this.closeTab.addEventListener("click", () => {
                        this.cancelMarker(marker);
                    });
                }
            }
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
                this.openArticle(currentMarkerId, this.csrfToken, this.articleUrl);
            });
        });
    }
}