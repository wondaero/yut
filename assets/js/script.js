const abc = 'ABCDEFGDEF';
const getRandomNum = (mn, mx) => Math.floor(Math.random() * (mx - mn + 1)) + mn;

let groupInfo = ''; //333일경우 총 3그룹 한그룹당 3팀
// let teamArr = [];
let groupObj = {

}


bindingEvent();

const lastTag = (tag) => document.querySelectorAll(tag)[document.querySelectorAll(tag).length - 1];

document.getElementById('setAutoGroupBtn').addEventListener('click', () => {
    createGroup(true);
})
document.getElementById('setGroupBtn').addEventListener('click', () => {
    createGroup();
})

function createGroup(isAuto){
    const lis = document.querySelectorAll('#teamList li');
    let anyBlank = false;
    lis.forEach((li) => {
        if(!li.querySelector('input[data-id="teamName"]').value) anyBlank = true; 
    })

    if(anyBlank){
        alert('빈칸이 있습니다.');
        return;
    }

    if(!isAuto){
        const prmpt = window.prompt('생성 그룹을 입력해주세요.\nex)3명씩 3그룹: 333');

        if(!prmpt) return;

        if(!isNaN(+prmpt) && lis.length === prmpt.split('').reduce((sum, digit) => +sum + +digit, 0)){
            groupInfo = prmpt;
        }else{
            alert('팀 수를 확인해주세요.');
            return;
        }
    }else{
        groupInfo = calcGroup(lis.length);
    }

    document.getElementById('groupList').innerHTML = '';
    groupObj = {};

    for(let i = 0; i < groupInfo.length; i++){
        document.getElementById('groupList').appendChild(groupTmpl(groupInfo[i], i));
        groupObj[abc[i]] = [];
    }

    addTeam2Group();
    setVsList();
}


function calcGroup(len){
    group = '';

    switch(len){
        case 8:
            group = '44';
            break;
        case 9:
            group = '333';
            break;
        case 10:
            group = '433';
            break;
        case 11:
            group = '443';
            break;
        case 12:
            group = '3333';
            break;
        case 13:
            group = '4333';
            break;
        case 14:
            group = '4433';
            break;
        case 15:
            group = '4443';
            break;
        default:
            alert('팀 수가 맞지 않습니다.');
    }

    return group;
}

function addTeam2Group(){
    for(let i = 0; i < document.querySelectorAll('#teamList li').length; i++){
        addTeam2ThisGroup(i);
    }

    
    for(let key in groupObj){
        groupObj[key].forEach((el, idx) => {
            document.querySelector('#groupList fieldset[data-group-id="' + key + '"] [data-id="teamListInGroup"]').appendChild(liTmplInGroup(el, idx));
        })
        
    }
}

function addTeam2ThisGroup(i){
    if(!groupInfo) return;
    const rdmNum = getRandomNum(0, groupInfo.length - 1);
    if(groupObj[abc[rdmNum]].length >= +groupInfo[rdmNum]) return addTeam2ThisGroup(i);

    groupObj[abc[rdmNum]].push(document.querySelectorAll('#teamList li')[i].querySelector('input').value);

}

function setVsList(){
    document.getElementById('vsList').innerHTML = '';
    for(let key in groupObj){
        document.getElementById('vsList').appendChild(vsListTmpl(key));
    }

    document.querySelectorAll('#groupList [data-group-id]').forEach(group => {
        const lis = group.querySelectorAll('[data-id="teamListInGroup"] li');
        for(let i = 0; i < lis.length; i++){
            for(let j = 1; j < lis.length - i + 1; j++){
                if(!lis[i + j]) continue;

                const groupId = lis[i].closest('[data-group-id]').dataset.groupId;
                document.querySelector('#vsList [data-group-id="' + groupId + '"] ul').appendChild(liTmplInVsList(lis[i], lis[i + j]));

            }
        }
    })
}

function setRecord(){
    document.querySelectorAll('#groupList [data-group-id]').forEach(f => {
        f.querySelectorAll('ul li').forEach(li => {
            let groupId = li.closest('[data-group-id]').dataset.groupId;
            let win = 0;
            let lose = 0;
            document.querySelectorAll('#vsList [data-group-id="' + groupId + '"]').forEach(f2 => {
                const lis = f2.querySelectorAll('ul li');
                let gameCnt = 0;
                let totalCnt = lis.length;
                lis.forEach(li2 => {
                    if(li2.querySelector('.win')){
                        gameCnt++;
                        if(li2.querySelector('.win').dataset.code === li.dataset.idx){
                            win++;
                        }else{
                            if(li2.dataset.code.indexOf(li.dataset.idx) > -1){
                                lose++;
                            }
                        }

                    }
                })

                let percentVal = (gameCnt / totalCnt * 100).toFixed(2);
                if(percentVal.split('.')[0] === '100') percentVal = 100;

                f2.querySelector('legend strong').innerHTML = gameCnt ? `(${percentVal}%)` : '';

            })

            li.querySelector('[data-id="record"]').innerHTML = '';
            if(win || lose){
                li.querySelector('[data-id="record"]').textContent = `(${win + lose}전 ${win}승 ${lose}패)`;
            }

        })

    })
}


function bindingEvent(){
    function addRow(){
        document.getElementById('teamList').appendChild(liTmpl());
        lastTag('#teamList li').querySelector('input').focus();
        bindingEvent();

    }
    document.querySelectorAll('[data-id="addTeam"]').forEach(btn => {
        btn.onclick = addRow;
    })
    document.querySelectorAll('[data-id="removeTeam"]').forEach(btn => {
        btn.onclick = e => {
            if(document.querySelectorAll('#teamList li').length < 2){
                alert('적어도 1개는 있어야합니다.');
                return;
            }
            e.currentTarget.closest('li').remove();
            bindingEvent();
        }
    })
    const imputs = document.querySelectorAll('[data-id="teamName"]');
    imputs.forEach(input => {
        input.onkeyup = e => {
            if(e.keyCode === 13){
                if(e.currentTarget === lastTag('[data-id="teamName"]')){
                    addRow();
                }else{
                    const allInput = Array.from(imputs);
                    const thisIdx = allInput.indexOf(e.currentTarget);

                    imputs[thisIdx + 1].focus();
                    imputs[thisIdx + 1].select();
                }
            };
        }
    });
}

const liTmpl = () => {
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="text" data-id="teamName" />
        <button data-id="removeTeam">-</button>
        <button data-id="addTeam">+</button>
    `;

    return li;
};

const groupTmpl = (len, idx) => {
    const fieldset = document.createElement('fieldset');
    fieldset.dataset.len = len;
    fieldset.dataset.groupId = abc[idx];
    fieldset.innerHTML = `
        <legend>${abc[idx]}</legend>
        <ul data-id="teamListInGroup"></ul>
    `;

    return fieldset;
}
const vsListTmpl = (groupNm) => {
    const fieldset = document.createElement('fieldset');
    fieldset.dataset.groupId = groupNm;
    fieldset.innerHTML = `
        <legend>${groupNm}<strong></strong></legend>
        <ul data-id="vsList">
        </ul>
    `;

    return fieldset;
}

const liTmplInGroup = (name, idx) => {
    const li = document.createElement('li');
    li.dataset.idx = idx;
    li.innerHTML = `
        <strong>${name}</strong>
        <span data-id="record"></span>
    `;

    return li;
}
const liTmplInVsList = (a, b) => {
    const li = document.createElement('li');
    li.dataset.code = (a.dataset.idx + '' + b.dataset.idx);
    li.innerHTML = `
        <strong data-id="a" data-code="${a.dataset.idx}">${a.textContent}</strong>
        <span>VS</span>
        <strong data-id="b" data-code="${b.dataset.idx}">${b.textContent}</strong>
    `;

    li.querySelectorAll('[data-id]').forEach(t => {
        t.addEventListener('click', e => {
            const ab = e.currentTarget.dataset.id;
            const code = e.currentTarget.dataset.code;

            if(e.currentTarget.classList.contains('win')){
                e.currentTarget.classList.remove('win');
            }else{
                e.currentTarget.classList.add('win');
                e.currentTarget.closest('li').classList.remove('ing');
                li.querySelector('[data-id="' + (ab === 'a' ? 'b' : 'a') + '"]').classList.remove('win');
            }

            setRecord();
        })
    })

    li.querySelector('span').addEventListener('click', e => {
        e.currentTarget.closest('li').classList.toggle('ing');
        // if(e.currentTarget.closest('li').classList.contains('ing')){
        //     e.currentTarget.closest('li').classList.remove('ing');
        // }else{
        //     e.currentTarget.closest('ul').querySelectorAll('li').forEach(li => {
        //         li.classList.remove('ing');
        //     });
        //     e.currentTarget.closest('li').classList.add('ing');
        // }
    })

    return li;
}


window.onload = () => {
    document.querySelectorAll('[data-id="teamName"]')[0].focus();
}