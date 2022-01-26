import App from './App.svelte'

import * as THREE from 'three'
import { linkThree } from 'svelte-three'
linkThree(THREE)

const app = new App({
	target: document.body
});

export default app;