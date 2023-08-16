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
    private djangoUsername?: string;

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
        // this.djangoUsername = "{{ user.get_username }}"; // This line might need adjustment based on your setup
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

}