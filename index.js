window.onload = function() {
    // 清理遗留的留言板数据（localStorage）
    try { localStorage.removeItem('guestbook'); } catch (e) { /* ignore */ }
    const catImg = document.getElementById('catImg');
    const catSound = document.getElementById('catSound');
    const catCounter = document.getElementById('catCounter');
    // 读取本地保存的次数，没有则为 0
    let count = Number(localStorage.getItem('catCount')) || 0;
    catCounter.textContent = `撸猫次数:${count}`;

    catImg.addEventListener('mousedown', () => {
        catSound.currentTime = 0;
        catSound.play();
        count++;
        catCounter.textContent = `撸猫次数:${count}`;
        // 保存到本地
        localStorage.setItem('catCount', count);
    });

    // 时间显示模块
    const timeDiv = document.getElementById('time');
    // 修改时间显示功能
    function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('clock').textContent = `${h}:${m}:${s}`;
        document.getElementById('date').textContent = `${year}/${month}/${day}`;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // 添加搜索引擎切换功能
    document.getElementById('searchButtonWeb').addEventListener('click', function() {
        const engineList = document.querySelector('.search-engines');
        engineList.classList.toggle('show');
    });

// 搜索引擎选择处理
    document.querySelector('.search-engines').addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            const engine = e.target.dataset.engine;
            const searchText = document.getElementById('searchInput').value;
            let searchUrl;
        
            switch(engine) {
                case 'google':
                searchUrl = `https://www.google.com/search?q=${searchText}`;
                break;
                case 'bing':
                searchUrl = `https://www.bing.com/search?q=${searchText}`;
                break;
                case 'baidu':
                searchUrl = `https://www.baidu.com/s?wd=${searchText}`;
                break;
            }
        
        if (searchUrl) window.open(searchUrl, '_blank');
            document.querySelector('.search-engines').classList.remove('show');
        }
    });

// 热门内容时间筛选
    document.querySelector('.time-selector').addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
        // 移除其他按钮的active类
            this.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        // 添加当前按钮的active类
            e.target.classList.add('active');
        
        // 这里可以根据不同时间段加载不同的热门内容
            const timeRange = e.target.dataset.time;
            loadHotContent(timeRange);
        }
    });

    function loadHotContent(timeRange) {
    // 这里添加加载不同时间范围热门内容的逻辑
        console.log(`Loading content for time range: ${timeRange}`);
    }



    // 番茄钟模块
    let isPaused = false;
    let pomodoroTime = 25 * 60;
    let pomodoroInterval = null;
    const pomodoroTimeSpan = document.getElementById('pomodoroTime');
    const pomodoroStartBtn = document.getElementById('pomodoroStart');
    const pomodoroResetBtn = document.getElementById('pomodoroReset');
    const pomodoroPlusBtn = document.getElementById('pomodoroPlus');
    const pomodoroMinusBtn = document.getElementById('pomodoroMinus');

    function updatePomodoroDisplay() {
        const min = String(Math.floor(pomodoroTime / 60)).padStart(2, '0');
        const sec = String(pomodoroTime % 60).padStart(2, '0');
        pomodoroTimeSpan.textContent = `${min}:${sec}`;
    }

    pomodoroStartBtn.onclick = function() {
        if (!pomodoroInterval) {
        // 开始计时
        pomodoroStartBtn.textContent = "暂停";
        isPaused = false;
        startPomodoro();
        } else {
        // 暂停/继续
            if (isPaused) {
                pomodoroStartBtn.textContent = "暂停";
                isPaused = false;
                startPomodoro();
            } else {
                pomodoroStartBtn.textContent = "继续";
                isPaused = true;
                clearInterval(pomodoroInterval);
                pomodoroInterval = null;
            }
        }
    };
    function startPomodoro() {
    pomodoroInterval = setInterval(() => {
        if (pomodoroTime > 0) {
            pomodoroTime--;
            updatePomodoroDisplay();
        } else {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            pomodoroStartBtn.textContent = "开始";
            updatePomodoroDisplay();
            catSound.currentTime = 0;
            catSound.play();
            alert('番茄钟结束！');
            }
        }, 1000);
    }

    pomodoroResetBtn.onclick = function() {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        pomodoroTime = 25 * 60;
        updatePomodoroDisplay();
    // 重置时恢复为未开始状态，确保按钮显示为“开始”而不是“继续”
    isPaused = false;
    pomodoroStartBtn.textContent = '开始';
    };

    pomodoroPlusBtn.onclick = function() {
        if (pomodoroTime + 5 * 60 <= 900 * 60) {
            pomodoroTime += 5 * 60;
        } else {
            pomodoroTime = 900 * 60;
        }
        updatePomodoroDisplay();
    };

    pomodoroMinusBtn.onclick = function() {
        pomodoroTime = Math.max(0, pomodoroTime - 5 * 60);
        updatePomodoroDisplay();
    };

    const pomodoroPrevBtn = document.getElementById('pomodoroPrev');
    const pomodoroNextBtn = document.getElementById('pomodoroNext');

    pomodoroPrevBtn.onclick = function() {
        pomodoroTime = Math.max(0, pomodoroTime - 20 * 60);
        updatePomodoroDisplay();
    };

    pomodoroNextBtn.onclick = function() {
        if (pomodoroTime + 20 * 60 <= 900 * 60) {
            pomodoroTime += 20 * 60;
        } else {
            pomodoroTime = 900 * 60;
        }
        updatePomodoroDisplay();
    };


// 番茄钟拖动功能
    const pomodoro = document.getElementById('pomodoro');
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;

    pomodoro.addEventListener('mousedown', function(e) {
    // 只允许左键拖动，且不是点击隐藏按钮或其他交互控件（避免点击按钮时产生拖动）
    if (e.button !== 0) return;
    if (e.target.id === 'pomodoro-toggle') return;
    if (e.target.closest && e.target.closest('button,input,textarea,select,a')) return;
    isDragging = true;
    dragOffsetX = e.clientX - pomodoro.getBoundingClientRect().left;
    dragOffsetY = e.clientY - pomodoro.getBoundingClientRect().top;
    document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            let left = e.clientX - dragOffsetX;
            let top = e.clientY - dragOffsetY;

            const visibleMinLeft = 0; // 左侧不能超出屏幕
            const visibleMaxLeft = window.innerWidth - pomodoro.offsetWidth; // 右侧完全可见
            const hiddenAllowedLeft = window.innerWidth - 40; // 当隐藏时允许大部分移出，仅保留40px

            const maxTop = window.innerHeight - pomodoro.offsetHeight - 70; // 预留底部空间

            if (!isHidden) {
                // 正常显示时保持完全在视口内
                left = Math.max(visibleMinLeft, Math.min(visibleMaxLeft, left));
                top = Math.max(0, Math.min(maxTop, top));
            } else {
                // 隐藏状态下允许向右超出，但不完全跑远
                left = Math.max(visibleMinLeft - pomodoro.offsetWidth + 40, Math.min(hiddenAllowedLeft, left));
                top = Math.max(0, Math.min(maxTop, top));
            }

            pomodoro.style.right = 'auto';
            pomodoro.style.left = left + 'px';
            pomodoro.style.top = top + 'px';
            pomodoro.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
    });

// 番茄钟隐藏/显示功能
    let isHidden = true; // 初始为隐藏状态，使页面打开时番茄钟处于缩进
    const pomodoroToggle = document.getElementById('pomodoro-toggle');
    
    // 根据初始隐藏状态设置切换按钮文本与类
    pomodoroToggle.textContent = isHidden ? '打开番茄钟' : '收起番茄钟';
    if (isHidden) {
        pomodoro.classList.add('hide');
        // 保证初始样式与隐藏状态一致：靠右并贴近导航
        pomodoro.style.right = '0';
        pomodoro.style.bottom = '70px';
    } else {
        pomodoro.classList.remove('hide');
        pomodoro.style.right = '0';
        pomodoro.style.bottom = '70px';
    }
    pomodoroToggle.onclick = function(e) {
        e.stopPropagation();
        isHidden = !isHidden;
        if (isHidden) {
            pomodoro.classList.add('hide');
            pomodoroToggle.textContent = '打开番茄钟';
            // 保留当前的 top 值，设置 right: 0
            pomodoro.style.right = '0';
            pomodoro.style.bottom = pomodoro.style.top ? `calc(100vh - ${pomodoro.style.top} - ${pomodoro.offsetHeight}px)` : '70px';
        } else {
            pomodoro.classList.remove('hide');
            pomodoroToggle.textContent = '收起番茄钟';
            // 恢复显示时的位置，保持拖动的 top 值
            pomodoro.style.right = pomodoro.style.top ? '' : '0';
            pomodoro.style.bottom = pomodoro.style.top ? `calc(100vh - ${pomodoro.style.top} - ${pomodoro.offsetHeight}px)` : '70px';
        }
        // 恢复初始定位
        pomodoro.style.left = '';
        
    };
    updatePomodoroDisplay();
};

// ...existing code...

document.addEventListener('DOMContentLoaded', function () {
    // 定义小说名称与对应页面的映射（根据实际情况补充）
    const novelPages = {
        "龙与花": "dragon_and_flower.html"
    };

    // 匹配格式为 《小说名》 的文本
    const novelRegex = /《([^》]+)》/g;

    // 获取页面中所有列表项
    const listItems = document.querySelectorAll('li');
    listItems.forEach(li => {
        li.innerHTML = li.innerHTML.replace(novelRegex, (match, novelName) => {
            // 如果有对应的页面就链接到该页面，否则链接为空（可自行修改逻辑）
            const url = novelPages[novelName] ? novelPages[novelName] : "#";
            return `<a href="${url}">${match}</a>`;
        });
    });

    // 将现有 .two-columns 列表重构为左右两个独立垂直列表（向下延伸，取消内部滚动）
    const twoCols = document.querySelectorAll('.two-columns');
    twoCols.forEach((origUl, idx) => {
        const items = Array.from(origUl.querySelectorAll('li'));

        // 创建容器和两列 ul
        const wrapper = document.createElement('div');
        wrapper.className = 'two-columns-grid';
        const leftUl = document.createElement('ul');
        leftUl.className = 'col';
        const rightUl = document.createElement('ul');
        rightUl.className = 'col';

        // 特殊处理：如果这是 main_left 下的第一个 two-columns（最近更新）
        if (origUl.closest('.main_left') && origUl === document.querySelector('.main_left .two-columns')) {
            // 确保最近更新总共 10 条：左 5，右 4 + 更多
            const maxItems = 9; // 真正的内容条数（不包含更多）
            const contentItems = items.slice(0, maxItems);
            // 左边放前 5 条
            const leftCount = 5;
            for (let i = 0; i < Math.min(leftCount, contentItems.length); i++) {
                leftUl.appendChild(contentItems[i]);
            }
            // 右边放接下来的 4 条
            for (let i = leftCount; i < contentItems.length; i++) {
                rightUl.appendChild(contentItems[i]);
            }
            // 最后一条为 更多 链接
            const moreLi = document.createElement('li');
            moreLi.innerHTML = `<a href="novels.html" class="more-link">更多 &gt;&gt;</a>`;
            rightUl.appendChild(moreLi);
        } else {
            // 默认行为：均匀分配到两列（先填左再填右），不使用横向分页
            const half = Math.ceil(items.length / 2);
            items.slice(0, half).forEach(it => leftUl.appendChild(it));
            items.slice(half).forEach(it => rightUl.appendChild(it));
        }

        // 用 wrapper 替换原 ul
        wrapper.appendChild(leftUl);
        wrapper.appendChild(rightUl);
        origUl.replaceWith(wrapper);
    });
});

// 备用：当 header 中元素总宽度超过可见宽度时，强制让 search 换行以避免重叠
function ensureHeaderNoOverlap() {
    const headerDiv = document.getElementById('header_div');
    if (!headerDiv) return;
    const header = document.getElementById('header');
    const time = document.getElementById('time');
    const search = document.getElementById('search');
    const cat = document.getElementById('cat');

    // 计算这些元素的外边距盒子所需宽度
    const totalWidth = [header, time, search, cat].reduce((sum, el) => {
        if (!el) return sum;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const marginLeft = parseFloat(style.marginLeft) || 0;
        const marginRight = parseFloat(style.marginRight) || 0;
        return sum + rect.width + marginLeft + marginRight;
    }, 0);

    // 如果总宽度明显大于视口宽度，添加类促使 search 换行（CSS 已定义 order 与 flex）
    if (totalWidth > window.innerWidth - 20) {
        headerDiv.classList.add('search-wrapped');
    } else {
        headerDiv.classList.remove('search-wrapped');
    }
    // 把 header 的实际高度写入 CSS 变量，main_content 会使用该值作为顶部间距，避免重合
    const headerHeight = Math.ceil(headerDiv.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
}

window.addEventListener('load', ensureHeaderNoOverlap);
window.addEventListener('resize', function () {
    // 防抖
    clearTimeout(window._ensureHeaderNoOverlapTimeout);
    window._ensureHeaderNoOverlapTimeout = setTimeout(ensureHeaderNoOverlap, 120);
});

// ...existing code...