const mammoth = require("mammoth");
const path = require("path");
const fs = require("fs");

const docPath = path.join(__dirname, "soil_quality_report_refined (1).docx");

mammoth.extractRawText({path: docPath})
    .then(function(result){
        fs.writeFileSync(path.join(__dirname, "document_content_utf8.txt"), result.value, "utf8");
    })
    .catch(console.error);
