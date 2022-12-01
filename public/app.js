let referenceButton = document.getElementById("ref-button");
let VCFProcessBUtton = document.getElementById("vcf-button");
let vcfSubmitButton = document.getElementById("submit_vcf");
let coverageButton = document.getElementById("reference-button");
referenceButton.addEventListener("click", async function (event) {
  try {
    event.preventDefault();
    event.target.disabled = true;
    let response = await axios.get("UpdateData/process/Reference");
    event.target.disabled = false;
    let header = document.createElement("h3");
    header.innerText = response.data;
    document.body.appendChild(header);
  } catch (err) {

    let response = err.response.data
    event.target.disabled = false;
    let header = document.createElement("h3");
    header.innerText = response;
    document.body.appendChild(header);
    console.log(err);
  }
});

VCFProcessBUtton.addEventListener("click", async function (e) {
  try {
    e.preventDefault();
    e.target.disabled = true;
    let response = await axios.get("/UpdateData/process/vcf");
    let header = document.createElement("h3");
    header.innerText = "Vcf Processed !";
    document.body.appendChild(header);
  } catch (e) {
    console.log(e);
  }
});

vcfSubmitButton.addEventListener("click", async function (e) {
  try {
    e.preventDefault();
    var formData = new FormData();
    var imagefile = document.querySelector("#myFile");
    //console.log(imagefile.files[0])
    formData.append("myFile", imagefile.files[0]);

    let responsed = await axios.post("/upload_data", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    let header = document.createElement("h3");
    header.innerText = "Vcf Uploaded!";
    document.body.appendChild(header);
  } catch (err) {
    console.log(err);
  }
});



coverageButton.addEventListener("click", async function (e) {
  try {
    e.preventDefault();
    e.target.disabled = true;
    let response = await axios.get("UpdateData/process/Coverage");
    e.target.disabled = false;
    let header = document.createElement("h3");
    header.innerText = "Coverage Processed!";
    document.body.appendChild(header);
  } catch (e) {
    console.log(e);
  }
});