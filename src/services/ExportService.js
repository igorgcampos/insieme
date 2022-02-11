
const exportService = {}

exportService.install = function (Vue) {

    Vue.prototype.$downloadCSV = (objectsArray, fileName) => {

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += [
            Object.keys(objectsArray[0]).join(";"),
            ...objectsArray.map((item) => Object.values(item).join(";"))
        ]
            .join("\n")
            .replace(/(^\[)|(\]$)/gm, "");

        const data = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", data);
        link.setAttribute("download", fileName + ".csv");
        link.click();
    }
}

export default exportService;