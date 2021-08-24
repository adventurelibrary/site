import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ app }: { app: any }) => {
	Vue.use(VueGtag, {
		config: { id: 'UA-204701992-1' },
	}, app.router);
}