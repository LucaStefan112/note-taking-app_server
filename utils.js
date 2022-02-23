// Mapping the json data to string:
const dataToString = data => {
    let content = '[';
        for(let i = 0; i < data.length; i++){
            const note = data[i];
            content += '{\"id\":' + note.id + ',\"name\":\"' + note.name + '\",\"content\":\"' + note.content + '\"}'
            if(i < data.length - 1) content += ','
        }
        content += ']'
    
    return content
}

module.exports = { dataToString }