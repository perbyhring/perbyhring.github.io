
<Three.WebGLRenderer
	args={{antialias: true, powerPreference: 'high-performance'}}
	physicallyCorrectLights={true}
	outputEncoding={THREE.sRGBEncoding}
	toneMapping={THREE.ACESFilmicToneMapping}>
	<Three.Scene>
		<Three.PerspectiveCamera position-z=4 />

		<Three.Fog attach="fog" near={DEPTH * .9} far={DEPTH} color="black" />

		<Three.PointLight power=400 decay=2 onTick:position-lerp={[lightPosition, .1]}>
			<Three.Mesh>
				<Three.SphereGeometry args=.1 />
				<Three.MeshBasicMaterial />
				
			</Three.Mesh>
			<Three.Group position-x={.3}>
				<ThreeDom pointerEvents={false}>
					<span>I Am The Light</span>
				</ThreeDom>
			</Three.Group>
		</Three.PointLight>

		<InstancedMesh count={instances.length} useEvents on:pointermove={handlePointerMove} onTick={loop}>
			<Three.SphereGeometry args={[.4,16,8]} />
			<Three.MeshStandardMaterial roughness=.1 />
			{#each instances as {position, scale, color}}
				<MeshInstance position={position} scale={scale} color={color} />
			{/each}
		</InstancedMesh>

	</Three.Scene>
</Three.WebGLRenderer>

<style>
	span {
		font-family:monospace;
		font-size:10px;
		position:relative;
		display:block;
		color:white;
		transform:translateY(-50%);
	}
</style>

<script>
	
	import { Three, ThreeDom } from './svelte-three/index'
	import * as THREE from 'three'
	
	import InstancedMesh from './components/InstancedMesh.svelte'
	import MeshInstance from './components/MeshInstance.svelte'

	import SimplexNoise from 'simplex-noise'
	const simplex = new SimplexNoise()
	
	const RADIUS = 5
	const DEPTH = 50
	
	const lightPosition = new THREE.Vector3(0,0,-10)
	
	const handlePointerMove = e => {
		const { x, y, z } = e.detail.intersection.point
		lightPosition.set(x * .7, y * .7, z)
	}
	
	let instances = [...new Array(3000)].map((v,i, {length}) => {
		const angle = Math.PI * 2 / 360 * 137.5 * i
		const position = [
			Math.cos(angle) * RADIUS,
			Math.sin(angle) * RADIUS,
			(i / length) * -DEPTH
		]
		return {
			angle: angle,
			origin: [...position],
			position: [...position],
			color: 'white'
		}
	})
	
	let t = 0
	const loop = (object, delta, deltaTime, time) => {
		t += delta * .002
		
		instances.forEach((instance, i) => {
			let [x,y,z] = instance.origin
			z = z > 0 ? -DEPTH : z + .05
			x = Math.cos(instance.angle) * (RADIUS + (z * .075))
			y = Math.sin(instance.angle) * (RADIUS + (z * .075))	
			instance.origin = [x,y,z] 
			
			const noise = simplex.noise4D(x * .05, y * .05, z * .05, t)
			instance.position = [
				x + Math.cos(noise * Math.PI),
				y + Math.sin(noise * Math.PI),
				z + noise
			]
	
			const colorNoise = simplex.noise3D(x * .3, y * .3, t)
			const color = Math.min(255, Math.floor(Math.abs((colorNoise + noise) / 2) * 255))
			instance.color = `rgb(${color},${color},${color})`
		})
		instances = instances
	}
	
	</script>