// Load data from the JSON file
fetch("https://huggingface.co/litagin/rvc_okiba/raw/main/mst_data.json")
  .then((response) => response.json())
  .then((data) => {
    const nodes = new vis.DataSet(data.nodes);
    const edges = new vis.DataSet(
      data.edges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        length: edge.length * 1000, // Adjust the multiplier as needed
        value: 1 / edge.length, // Adjust the multiplier as needed
        title: edge.length * 100,
      }))
    );

    const container = document.getElementById("network");
    const graphData = { nodes: nodes, edges: edges };
    const options = {
      nodes: {
        font: {
          size: 40,
        },
      },
      edges: {
        smooth: false,
        chosen: false,
      },
      physics: {
        barnesHut: {
          // springConstant: 1,
          // centralGravity: 0,
          gravitationalConstant: -10000,
        },
      },
    };

    const network = new vis.Network(container, graphData, options);

    // Add event listener for node clicks
    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodeName = nodes.get(nodeId).label; // Assuming label is the same as node name

        // Update infoview
        document.getElementById("node-name").textContent = nodeName;
        document.getElementById("node-audio").src = "";
      }
    });
  })
  .catch((error) => console.error("Error loading the MST data:", error));

let currentAudio = null;

// Function to play sound
function playSound(nodeName, type) {
  let soundUrl;
  if (type === "corpus") {
    soundUrl = `https://huggingface.co/litagin/rvc_okiba/resolve/main/jvs-samples/${nodeName}.wav`;
  } else if (type === "song") {
    soundUrl = `https://huggingface.co/litagin/rvc_okiba/resolve/main/song-samples/${nodeName}.wav`;
  } else if (type === "vc") {
    soundUrl = `https://huggingface.co/litagin/rvc_okiba/resolve/main/voice-change-samples/${nodeName}.mp3`;
  }
  console.log(soundUrl);
  const audio = document.getElementById("node-audio");
  audio.src = soundUrl;
  audio.play();
  // currentAudio = new Audio(soundUrl);
  // currentAudio.play();
}

// Event listeners for buttons
document.getElementById("play-corpus").addEventListener("click", function () {
  const nodeName = document.getElementById("node-name").textContent;
  if (nodeName) {
    playSound(nodeName, "corpus");
  }
});

document.getElementById("play-song").addEventListener("click", function () {
  const nodeName = document.getElementById("node-name").textContent;
  if (nodeName) {
    playSound(nodeName, "song");
  }
});

document.getElementById("play-vc").addEventListener("click", function () {
  const nodeName = document.getElementById("node-name").textContent;
  if (nodeName) {
    playSound(nodeName, "vc");
  }
});

document.getElementById("open-url").addEventListener("click", function () {
  const nodeName = document
    .getElementById("node-name")
    .textContent.replace("Selected Node: ", "");
  if (nodeName) {
    window.open(
      `https://huggingface.co/litagin/rvc_okiba/tree/main/models/${nodeName}`,
      "_blank"
    );
  }
});