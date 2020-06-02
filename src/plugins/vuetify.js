import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import en from '../i18n/en.ts'
import pt from '../i18n/pt.ts'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { en, pt },
        current: 'pt',
    }
});
