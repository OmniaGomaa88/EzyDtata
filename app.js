// .................................................................................

// set random ids

function guid() {
  // Even if result is good, the one from uuid.js is prefered
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function is_guid(value) {
  // Even if result is good, the one from uuid.js is prefered
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
let blockId = {};
//

// function pour set id dinamique pour elment img selon son src et son parent
function SetELmentImgId(el) {
  const imgSrc = el.src.split("/");
  const imgSrcLastItem = imgSrc[imgSrc.length - 1];
  const parentId = el.parentElement.id;
  el.id = parentId.concat(imgSrcLastItem);
}

// creat Block  construction object
const blocksContainer = document.getElementById("blocks");
const Block = function ({ title, styleClass, parentElement }) {
  this.title = title;
  this.styleClass = styleClass;
  const element = document.createElement("div");
  const text = document.createElement("h1");
  element.appendChild(text);
  text.innerHTML = title;
  element.classList.add(styleClass);
  element.setAttribute("draggable", "true");
  parentElement.appendChild(element);
  element.id = element.textContent;
  //  dragstart function prototype
  element.ondragstart = function (ev) {
    ev.dataTransfer.setData("text/plain", element.id);
    ev.dataTransfer.dropEffect = "copy";
    const { layerX, layerY } = ev;
    //  set data de posistion on jason object
    ev.dataTransfer.setData("mouse", JSON.stringify({ layerX, layerY }));
    ev.dataTransfer.dropEffect = "copy";
  };
  element.setAttribute("data-draggable", "copiedElement");
};
// ........

//  créer new object blocks
const input = new Block({
  title: "input",
  styleClass: "input",
  parentElement: blocksContainer,
});
const replace = new Block({
  title: "replace",
  styleClass: "replace",
  parentElement: blocksContainer,
});
const output = new Block({
  title: "output",
  styleClass: "output",
  parentElement: blocksContainer,
});
// imgs  construction

const ArrowElment = function ({ src, parentElement, styleClass }) {
  const imgElment = document.createElement("img");
  imgElment.src = src;
  imgElment.classList.add(styleClass);
  parentElement.appendChild(imgElment);
  // Call function setimgId
  SetELmentImgId(imgElment);
  this.id = imgElment.id;
  // ajouter class dans ArrowElment chaque fois on céer relation
  // pour vérifier aprés si cette relation a créer ou pas
  const ParentText = parentElement.textContent;
  imgElment.classList.add(ParentText.concat("Arrow"));
};

//  creat DropElment
const DropArea = function ({ parentElement, styleClass }) {
  const DropElment = document.createElement("div");
  parentElement.appendChild(DropElment);
  DropElment.classList.add(styleClass);
  DropElment.ondragover = function (ev) {
    // donner le div color lors de drop
    DropElment.style.background = "lightblue";
    ev.dataTransfer.dropEffect = "copy";
    ev.preventDefault();
  };
  // function ondrop event

  DropElment.ondrop = function (ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("Text/plain");
    const blockOrigin = document.getElementById(data);
    // vérifier que premier elment est input
    if (blockOrigin.id == "input") {
      // creat new object de CopyElment
      const BlockCopy = new CopyElment({
        elementOrigin: blockOrigin,
        parentElement: ev.target,
        styleClass: "newElmentStyle",
      });
    }
    // vérifier que premier input elemnt est input et dinier elment est output
    else if (
      ev.target.firstChild.textContent == "input" &&
      ev.target.lastChild.textContent != "output"
    ) {
      // creat new object de CopyElment
      const BlockCopy = new CopyElment({
        elementOrigin: blockOrigin,
        parentElement: ev.target,
        styleClass: "newElmentStyle",
      });
    }

    // dropAreat réturne whit aprés drop
    DropElment.style.backgroundColor = "white";
  };
};

// creat workPlace
const workPlaceContainer = document.getElementById("myDiagramDiv");
const workPlace = new DropArea({
  parentElement: workPlaceContainer,
  styleClass: "workPlace",
});

// creat Buttons
const Button = function ({ src, parentElement, styleClass, onclick }) {
  const ButtonElement = document.createElement("img");
  this.src = src;
  ButtonElement.onclick = onclick;
  ButtonElement.src = this.src;
  ButtonElement.classList.add(styleClass);
  parentElement.appendChild(ButtonElement);
  this.parentElement = this.parentElement;
  // call setImgId funtction
  const parentId = ButtonElement.parentElement.id;

  SetELmentImgId(ButtonElement);
};

let blocks = [];

function getAllData() {
  let values = [];
  blocks.forEach((block) => {
    console.log({block});
    const data = block.data;
    values.push(data);
  });
  return values;
}

// creat copyElment
const CopyElment = function ({ elementOrigin, parentElement, styleClass }) {
  const copyElment = elementOrigin.cloneNode();
  const text = document.createElement("h1");
  title = elementOrigin.textContent;
  text.innerHTML = title;
  this.title = title;
  copyElment.appendChild(text);
  copyElment.id = guid();
  this.id = copyElment.id;
  blockId[container.id] = this;
  this.text = copyElment.textContent;
  parentElement.appendChild(copyElment);
  copyElment.setAttribute("draggable", "false");
  copyElment.classList.add(styleClass);
  this.styleClass = styleClass;
  this.Bottom = copyElment.offsetBottom;
  copyElment.classList.add(copyElment.textContent.concat("Block"));

  blocks.push(this);
  
  this.textContent = copyElment.textContent;
  
  
  this.data = {}; 
  

  // creat new Button pour suprimmer l'elment
  const DeletButton = new Button({
    src: "imges/delete.svg",
    parentElement: copyElment,
    styleClass: "DeletButton",
    id: parentElement.id.concat("DeletButton"),
    onclick: () => {
      copyElment.parentElement.removeChild(copyElment);
    },
  });

  // creat addButton pour ajouter elment
  const AddButton = new Button({
    src: "imges/plus.png",
    parentElement: copyElment,
    styleClass: "addButton",
    id: parentElement.id.concat("AddButton"),
    onclick: () => {
      const arroDown = new ArrowElment({
        src: "imges/down-arrow2.png",
        parentElement: copyElment,
        styleClass: "ArrowDown",
      });
    },
  });
  // creat MinusButton pour suprimer arrowElment
  const MinusButton = new Button({
    src: "imges/minus.png",
    parentElement: copyElment,
    styleClass: "minusButton",
    id: parentElement.id.concat("minusButton"),
    onclick: () => {
      AddButton.style.display = "none";
    },
  });

  //
  CopyElment.prototype.getData = function () {
    return this.data;
  };
  CopyElment.prototype.setData = function (data) {
    this.data = data;
  };

  // setData function
  const form = document.getElementById("form");
  CopyElment.prototype.setBlocksData = function () {
    const that = this;
    //  creat div pour afficher les data aprés submit
    const réglageTitle = document.getElementById("title");
    let CopyElmentText = this.textContent;
    réglageTitle.innerHTML = ` <span id="BlockText">${CopyElmentText}</span`;
    const inputsInput = Array.from(
      document.getElementsByClassName("inputInput")
    );
    const submitinput = document.querySelector(".inputSubmit");
  
    let elmentId = this.id;
    let elemntName = this.textContent;
    inputsInput.forEach((input) => {
      input.addEventListener("change", function () {
        let fristInput = inputsInput[0].value;
        let secoundInput = inputsInput[1].value;
       

        submitinput.addEventListener("click", () => {
            // chnage colore de form
    form.style.background = "#979793";
    setTimeout(() => {
      form.style.background = "rgb(173, 198, 199)";
    }, 1000);
          var blockInputData = {
            "id": elmentId,
            "name": elemntName,
            "src": fristInput,
            "value": secoundInput,
          };
          that.data = blockInputData;
         
         
        });
      });
    });
    // replaceData
    const replaceSubmit = document.querySelector(".replaceSubmit");
    const inputsReplace = Array.from(
      document.getElementsByClassName("replaceInput")
    );

    inputsReplace.forEach((input) => {
      input.addEventListener("change", function () {
        let fristInput = inputsReplace[0].value;
        let scoundInput = inputsReplace[1].value;

        replaceSubmit.addEventListener("click", () => {
                 // chnage colore de form
    form.style.background = "#979793";
    setTimeout(() => {
      form.style.background = "rgb(173, 198, 199)";
    }, 1000);
          var blockReplaceData = {
            "id": elmentId,
            "name": elemntName,
            "from": fristInput,
            "to": scoundInput,
          };
  
          that.data = blockReplaceData;
        });
      });
    });

    // outputData
    const outputSubmit = document.querySelector(".outputSubmit");
    const inputsOutput = Array.from(
      document.getElementsByClassName("outputInput")
    );
    inputsOutput.forEach((input) => {
       input.addEventListener("change",()=>  {
        let valeuInput = inputsOutput[0].value;
        outputSubmit.addEventListener("click", () => {
                 // chnage colore de form
    form.style.background = "#979793";
    setTimeout(() => {
      form.style.background = "rgb(173, 198, 199)";
    }, 1000);
          var blockOutput = {
            "id": elmentId,
            "name": elemntName,
            "value": valeuInput,
          };
       
         
          that.data = blockOutput;
          // creat input pour le titre
          form.innerHTML=`<lable>Entrez le titre</lable>
          <input type="text" placeholder="Entrez le titre" id="titre"></input>
          <button type="submit" id="Enregistre">Enregistre</button>
          `
       const Enregistre = document.getElementById("Enregistre")
       const titre= document.getElementById("titre")
       titre.addEventListener("change",()=>{
         const titreInputValue=titre.value
        Enregistre.addEventListener('click', (ev) => {
          const blocks=  getAllData()
          var dataObject={
            "id":1,
            "title":titreInputValue,
            "blocks": [
              {
                "id":blocks[0].id,
                "name":blocks[0].name,
                "src":blocks[0].src,
                "value":blocks[0].value,
                "dst":blocks[1].id
              },
              {
                "id":blocks[1].id,
                "name":blocks[1].name,
                "from":blocks[1].from,
                "to":blocks[1].to,
                "src":blocks[0].id,
                "dst":blocks[2].id
              },
              {
                "id":blocks[2].id,
                "name":blocks[2].name,
                "dst":blocks[2].dst,
                "value":blocks[2].value,
                "src":blocks[1].id
              }
            ],
            "hierarchy":{
              "name":blocks[2].name,
              "dst":blocks[2].dst,
              "value":blocks[2].value,
              "src":{
                "name":blocks[1].name,
                "from":blocks[1].from,
                "to":blocks[1].to,
                "regex":true,
                "src":{
                  "name":blocks[0].name,
                  "src":blocks[0].src,
                   "value":blocks[0].value
                }
              }
            }
          }
       
          console.log(dataObject)

          const showData = document.getElementById("réglage")
          showData.style.backgroundColor="rgb(227, 229, 233)"
          showData.style.height=1000+"px"

          form.style.display="none"
          showData.innerHTML =
           `<div id="showData">
          <h1> les Data </h1>
          <h2> Title:<span> ${dataObject.title}</spane></h2>
          <div id="blocksHeader">
          <img src="imges/Blocks.svg">
          <h2>Blocks</h2>
          </div>
        
          <div id="blocksData">

          <div class="block">
          <h2>${dataObject.blocks[0].name}</h2>
          <div class="blockData">
          <p> src:<span>${dataObject.blocks[0].src}</span></p>
          <p> value:<span>${dataObject.blocks[0].value}</span></p>
          </div>
          </div>

          <div class="block">
          <h2>${dataObject.blocks[1].name}</h2>
          <div class="blockData">
           <p> from:<span>${dataObject.blocks[1].from}</span></p>
          <p> to:<span>${dataObject.blocks[1].to}</span></p>
          </div>
          </div>


          <div class="block">
          <h2>${dataObject.blocks[2].name}</h2>
          <div class="blockData">
          <p> value:${dataObject.blocks[2].value}</p>
          </div>
          </div>

          </div>
          </div>
     
           `;
         })

       })
    
        });
        
      })
    
    });
  };

  // faire form dinamique en clickan l'elment
  
  copyElment.onclick = () => {
    const ElmenTextContent = copyElment.textContent;

    this.setFormData(ElmenTextContent);
   
    this.setBlocksData();

    // chagne backgroundColor
    copyElment.style.background = "#84878f";
    setTimeout(() => {
      copyElment.style.background = "#b7bbc5";
    }, 1000);
  };
};

// funstion pour from dinamique
const form = document.getElementById("form");

// create button pour changer valeur de textContet
CopyElment.prototype.setFormData = (text) => {
  form.style.backgroundColor = "rgb(173, 198, 199)";
  réglage.style.backgroundColor = "lightblue";
  setTimeout(() => {
    réglage.style.backgroundColor = "white";
  }, 1000);
  if (text === "input") {
    form.innerHTML = `
            
             <label> surce</label>
             <input type="text"  id ="src"  placeholder="Entrez src" class="inputInput">
             <label> value</label>
             <input type="text" class="inputInput" placeholder="Entrez value"> 
             <button value ="submit" id="submitData" class="inputSubmit" >Submit</button>
          
             `;
  } else if (text === "replace") {
    form.innerHTML = `
              <label> from</label>
              <input type="text" class="replaceInput">
              <br>
              <label> to</label>
              <input type="text" class="replaceInput">
              <label> regex</label>
              <select name="regexOption" >
              <option value="true">true</option>
              <option value="false">false</option>
              </select>
              <button value ="submit" id="submitData" class="replaceSubmit">Submit</button>
              `;
  } else {
    form.innerHTML = `
           <label> Value</label>
           <input type="text" class="outputInput">
           <button type="submit" value ="submit" id="submitData" class="outputSubmit">Submit</button>
           <!--button type="submit" value="Enrgestre" id="Enrgestre">Enregestre </button-->
      `;
  }
};

