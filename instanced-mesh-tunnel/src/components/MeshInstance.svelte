<script context="module">

import { getContext, onMount } from 'svelte'

const defaultPosition = [0,0,0]
const defaultScale = 1
const defaultRotation = [0,0,0]
const defaultColor = 0xFFFFFF

</script>

<script>

export let position = defaultPosition
export let scale = defaultScale
export let rotation = defaultRotation
export let color = defaultColor

const addInstance = getContext('three_instancedMeshAddInstance')

const instance = { position, scale, rotation, color }

$: instance.position = position
$: instance.scale = scale
$: instance.rotation = rotation
$: instance.color = color

onMount(() => addInstance(instance) )

</script>