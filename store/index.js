import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const state = () => ({
    longitude: 0,
    latitude: 0,
    address: '',
    currentPage: '首页',
    user: {}
})

export const mutations = {
    setLongitude(state, longitude){
        state.longitude = longitude;
    },
    setLatitude(state, latitude) {
        state.latitude=latitude;
    },
    setAddress(state, address){
        console.log(address);
        state.address = address;
    },
    changePage(state, page){
        state.currentPage = page
    },
    setUser(state, user){
        state.user = user
    }
}