//v1
const p = fetch('http://localhost:8000/student');
p.then((respons) => respons.json())
    // response.json() gibt ein promise zurück
    .then((student) => {
        console.log(student);
    });


//V2
    fetch('http://localhost:8000/student')
    .then((response) => response.json())
    .then((student) => {
        console.log(student);
    });


//V3
async function getStudent() {
    const resp = await fetch('http://localhost:8000/student')
    return await resp.json();
}

const student = await getStudent();
console.log(student);

