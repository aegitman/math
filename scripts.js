
const { PDFDocument, StandardFonts, rgb } = PDFLib
const fontSize = 7;

async function generatePDF() {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const page = pdfDoc.addPage([210, 297]);

    page.drawText('Name: .....................', {
        x: 10,
        y: 297 - fontSize - 10,
        size: fontSize,
        font: helveticaFont
      });        

      page.drawText('Date: ....../......./20......', {
        x: 130,
        y: 297 - fontSize - 10,
        size: fontSize,
        font: helveticaFont
      });        

    let bag = fillEquations(getRequest());

    let yOffset = 50;
    let xOffset = 10;
    let coll = 0;
    for (let i of bag) {
        page.drawText(i.a + ' ' + i.op + ' ' + i.b + ' = ____ ', {
            x: xOffset,
            y: 297 - fontSize - yOffset,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0.53, 0.71),
          });        
        xOffset+=70;          

        coll++;
        if(coll>2) {
            coll = 0;
            yOffset = yOffset + 15;
            xOffset = 10;
        }
        
    }

    page.drawText('Generated at: https://aegitman.github.io/math', {
        x: 10,
        y: 15,
        size: 5,
        font: helveticaFont
      });   

    
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    
    const linkSource = 'data:application/pdf;base64' + pdfDataUri;
    const downloadLink = document.createElement("a");
    const fileName = "abc.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

function generateTable(evt) {
  let $t = $("#table");

  $t.empty();

  let bag = fillEquations(getRequest());

  for (let i of bag) {
    $t.append($("<div>").append(generateTd(i)));
  }
}

function getRequest() {
  let operation = $("#operationSel").find("option:selected").val();
  let numbers = [];
  $("div.checkboxDiv input[type=checkbox]").each(function () {
    if ($(this).is(":checked")) {
      numbers.push($(this).attr("data-value"));
    }
  });

  if (numbers.length == 0 || operation == undefined) {
    return undefined;
  }

  return { n: numbers, a: operation, q: $("#quantity").val() };
}

function generateTd(bag) {
  let a = bag.a;
  let b = bag.b;
  // subtraction above 0
  if (bag.op == "-" && b > a) {
    a = bag.b;
    b = bag.a;
  }
  let $eq = $("<span>")
    .addClass("eqSpan")
    .text(a + " " + bag.op + " " + b + " = ");

  return $("<div>").addClass("equationDiv").append($eq);
}

function fillEquations(obj) {
  if (obj == undefined) {
    return [];
  }

  let objCount = Number(obj.n.length);

  let bag = [];
  let max = Number(obj.q) < 12 ? 12 : Number(obj.q);
  max = max > 40 ? 40 : max;

  for (let m = 0; m < Math.floor(max / objCount); m++) {
    // add at least one equation with every number
    for (let i of obj.n) {
      bag.push({ a: i, b: randomTo12(), op: obj.a[0] });
    }
  }

  for (let m = 0; m < Math.floor(max % objCount); m++) {
    // add the rest of the equations with every number
    bag.push({
      a: obj.n[Math.floor(Math.random() * obj.n.length)],
      b: randomTo12(),
      op: obj.a[0],
    });
  }

  return bag;
}

/**
 * Generates a random integer between 1 and 12 (inclusive).
 *
 * @returns {number} A random integer between 1 and 12.
 */
function randomTo12() {
  return Math.floor(Math.random() * 12 + 1);
}
