const content = "안녕하세요! \n 외국어와 개발 공부를 즐기는 박수연입니다. :)";
const text = document.querySelector(".text");
let i = 0;

function typing(){
    let txt = content[i++];
    text.innerHTML += txt=== "\n" ? "<br/>": txt;
    if (i > content.length) {
        text.textContent = "";
        i = 0;
    }
    else{
        //끝나면 반복종료 
        clearInterval(tyInt); 
    }
}
setInterval(typing, 150)