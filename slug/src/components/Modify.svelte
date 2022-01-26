<details>
  <summary>Modify</summary>
  <div class="controls">
    <div class="control">
      <strong>Eyes:</strong>
      <input type="range" min="0.2" max="1.5" step="0.001" bind:value={uniforms.u_eye_size.value} />
    </div>
    <div class="control">
      <strong>Iris:</strong>
      <input disabled={uniforms.u_eye_size.value < 0.4} type="range" min="0.2" max="0.94" step="0.001" bind:value={uniforms.u_iris_size.value} />
    </div>
    <div class="control">
      <strong>Pupils:</strong>
      <input disabled={uniforms.u_eye_size.value < 0.4} type="range" min="0.2" max="1.3" step="0.001" bind:value={uniforms.u_pupil_size.value} />
    </div>
    <div class="control">
      <strong>Nose:</strong>
      <input type="range" min="0.1" max="1.0" step="0.001" bind:value={uniforms.u_nose_size.value} />
    </div>
    <div class="control">
      <strong>Mouth:</strong>
      <input type="range" min="0.75" max="1.0" step="0.001" bind:value={uniforms.u_mouth_size.value} />
    </div>
  </div>
</details>

<style>
  details {
    position:absolute;
    top:20px;
    right:20px;
    color:#fff;
    font-family:monospace;
    font-size:12px;
    line-height:1.4;
    text-shadow:0 0 3px rgba(0,0,0,.85);
  }
  summary {
    margin-bottom:8px;
    text-align:right;
    cursor:pointer;
  }
  .controls {
    display:grid;
    grid-gap:2px;
  }
  .control {
    display:grid;
    grid-template-columns:64px 1fr;
    grid-gap:8px;
    align-items:center;
    line-height:1;
    padding:8px 8px 8px 12px;
    background:rgba(0,0,0,.25);
  }
  input[type="range"] {
    margin:0;
    padding:0;
  }
  strong {
    font-weight:normal;
  }
</style>

<script>

export let uniforms = {}

</script>