import App from './App.svelte'
import * as THREE from 'three'
import { linkThree } from './svelte-three/index'

linkThree(THREE)

new App({ target: document.body })