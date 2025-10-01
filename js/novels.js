window.onload = function() {
    // 安全地清理遗留的留言板数据（localStorage）
    try { localStorage.removeItem('guestbook'); } catch (e) { /* ignore */ }

    // 猫咪交互：如果页面包含相关节点才初始化，避免在无该元素的页面报错
    const catImg = document.getElementById('catImg');
    const catSound = document.getElementById('catSound');
    const catCounter = document.getElementById('catCounter');
    if (catImg && catSound && catCounter) {
        // 读取本地保存的次数，没有则为 0
        let count = Number(localStorage.getItem('catCount')) || 0;
        catCounter.textContent = `撸猫次数:${count}`;

        catImg.addEventListener('mousedown', () => {
            try { catSound.currentTime = 0; catSound.play(); } catch (e) { /* ignore audio errors */ }
            count++;
            catCounter.textContent = `撸猫次数:${count}`;
            // 保存到本地
            try { localStorage.setItem('catCount', count); } catch (e) { /* ignore */ }
        });
    }

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

    
    // 添加搜索相关交互，仅在相关 DOM 存在时绑定
    const searchButtonWeb = document.getElementById('searchButtonWeb');
    const searchEngines = document.querySelector('.search-engines');
    if (searchButtonWeb && searchEngines) {
        searchButtonWeb.addEventListener('click', function() {
            searchEngines.classList.toggle('show');
        });
    }

// 搜索引擎选择处理
    if (searchEngines) {
        searchEngines.addEventListener('click', function(e) {
            if (e.target.tagName === 'LI') {
                const engine = e.target.dataset.engine;
                const searchInput = document.getElementById('searchInput');
                const searchText = searchInput ? searchInput.value : '';
                let searchUrl;

                switch(engine) {
                    case 'google':
                        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchText)}`;
                        break;
                    case 'bing':
                        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchText)}`;
                        break;
                    case 'baidu':
                        searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchText)}`;
                        break;
                }

                if (searchUrl) window.open(searchUrl, '_blank');
                searchEngines.classList.remove('show');
            }
        });
    }

// 热门内容时间筛选
    const timeSelector = document.querySelector('.time-selector');
    if (timeSelector) {
        timeSelector.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                // 移除其他按钮的active类
                this.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                // 添加当前按钮的active类
                e.target.classList.add('active');

                // 根据不同时间段加载不同的热门内容
                const timeRange = e.target.dataset.time;
                loadHotContent(timeRange);
            }
        });
    }

    function loadHotContent(timeRange) {
    // 这里添加加载不同时间范围热门内容的逻辑
        console.log(`Loading content for time range: ${timeRange}`);
    }



    // 番茄钟模块：仅在页面包含 #pomodoro 时初始化
    const pomodoroRoot = document.getElementById('pomodoro');
    if (pomodoroRoot) {
        let isPaused = false;
        let pomodoroTime = 25 * 60;
        let pomodoroInterval = null;
        const pomodoroTimeSpan = document.getElementById('pomodoroTime');
        const pomodoroStartBtn = document.getElementById('pomodoroStart');
        const pomodoroResetBtn = document.getElementById('pomodoroReset');
        const pomodoroPlusBtn = document.getElementById('pomodoroPlus');
        const pomodoroMinusBtn = document.getElementById('pomodoroMinus');

        // 如果关键节点缺失，跳过初始化以避免后续错误
        if (!pomodoroTimeSpan || !pomodoroStartBtn || !pomodoroResetBtn || !pomodoroPlusBtn || !pomodoroMinusBtn) {
            return;
        }

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
        const pomodoro = pomodoroRoot;
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
        if (!pomodoroToggle) return;
    
    // 根据初始隐藏状态设置切换按钮文本与类
    pomodoroToggle.textContent = isHidden ? '番茄钟' : '收起';
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
            pomodoroToggle.textContent = '番茄钟';
            // 保留当前的 top 值，设置 right: 0
            pomodoro.style.right = '0';
            pomodoro.style.bottom = pomodoro.style.top ? `calc(100vh - ${pomodoro.style.top} - ${pomodoro.offsetHeight}px)` : '70px';
        } else {
            pomodoro.classList.remove('hide');
            pomodoroToggle.textContent = '收起';
            // 恢复显示时的位置，保持拖动的 top 值
            pomodoro.style.right = pomodoro.style.top ? '' : '0';
            pomodoro.style.bottom = pomodoro.style.top ? `calc(100vh - ${pomodoro.style.top} - ${pomodoro.offsetHeight}px)` : '70px';
        }
        // 恢复初始定位
        pomodoro.style.left = '';
        
    };
    // 关闭 pomodoroRoot 的 if 块
    }
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
    // 在首页（index.html 或 根路径）不进行自动链接替换，避免把首页的纯文本变成链接
    const path = window.location.pathname || '';
    const isIndex = path.endsWith('/index.html') || path.endsWith('/Index.html') || path === '/' || path === '';
    if (!isIndex) {
        listItems.forEach(li => {
            li.innerHTML = li.innerHTML.replace(novelRegex, (match, novelName) => {
                // 如果有对应的页面就链接到该页面，否则链接为空（可自行修改逻辑）
                const url = novelPages[novelName] ? novelPages[novelName] : "#";
                return `<a href="${url}">${match}</a>`;
            });
        });
    }

    // 将现有 .two-columns 列表重构为左右两个独立垂直列表（向下延伸，取消内部滚动）
    const twoCols = document.querySelectorAll('.two-columns');
    twoCols.forEach((origUl, idx) => {
        const items = Array.from(origUl.querySelectorAll('li'));

        // 如果存在任何一行的文本（去掉日期等）少于20字符，则整个列表切换为单列
        const hasShortLine = items.some(li => {
            // 只针对文本内容长度进行判断
            const text = li.textContent.trim().replace(/\s+/g, ' ');
            return text.length < 20;
        });

        // 创建容器和两列 ul
        const wrapper = document.createElement('div');
        wrapper.className = 'two-columns-grid';
        const leftUl = document.createElement('ul');
        leftUl.className = 'col';
        const rightUl = document.createElement('ul');
        rightUl.className = 'col';

        // 如果检测到短行，我们把所有条目放到左列（单列展示），但在 main_left 的“最近更新”场景保留“更多”链接
        if (hasShortLine) {
            if (origUl.closest('.main_left') && origUl === document.querySelector('.main_left .two-columns')) {
                const maxItems = 9; // 与之前逻辑一致，只显示前 9 条内容并在结尾显示更多链接
                const contentItems = items.slice(0, maxItems);
                contentItems.forEach(it => leftUl.appendChild(it));
                const moreLi = document.createElement('li');
                moreLi.innerHTML = `<a href="novels.html" class="more-link">更多 &gt;&gt;</a>`;
                leftUl.appendChild(moreLi);
            } else {
                // 直接把所有条目加入左列
                items.forEach(it => leftUl.appendChild(it));
            }
            wrapper.appendChild(leftUl);
            wrapper.appendChild(rightUl);
            wrapper.classList.add('single-column');
        } else {
            // 默认行为：均匀分配到两列（先填左再填右），不使用横向分页
            const half = Math.ceil(items.length / 2);
            items.slice(0, half).forEach(it => leftUl.appendChild(it));
            items.slice(half).forEach(it => rightUl.appendChild(it));
            wrapper.appendChild(leftUl);
            wrapper.appendChild(rightUl);
        }

        // 用 wrapper 替换原 ul
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
  async function loadNovels() {
  // 从 novels.json 文件获取小说数据
  const response = await fetch("novels.json");
  const novels = await response.json();

  // 找到网页中存放小说列表的元素
  const listEl = document.getElementById("novelList");
  const searchInput = document.getElementById("search");

  // 定义一个函数，用来渲染列表
  function render(filter="") {
    listEl.innerHTML = ""; // 先清空列表
        const q = (filter || '').toLowerCase();
        novels
            .filter(n => {
                if (!q) return true;
                // 在 title 或 desc 中查找（不区分大小写）
                const title = (n.title || '').toLowerCase();
                const desc = (n.desc || '').toLowerCase();
                return title.includes(q) || desc.includes(q);
            })
            .forEach(novel => { // 遍历剩下的小说
                // 使用 <a> 作为卡片容器，使整个卡片区域可点击
                const card = document.createElement('a');
                card.className = 'novel-card';
                card.href = `detail.html?id=${novel.id}`;
                card.setAttribute('role', 'link');
                card.setAttribute('aria-label', novel.title);
                card.dataset.id = novel.id;
                card.textContent = novel.title;
                listEl.appendChild(card);
      });
  }

    // 从 URL 中读取 search 参数，作为初始过滤器
    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get('search') || '';
    render(initialQ);

  // 当用户在搜索框输入文字时，重新渲染
  searchInput.addEventListener("input", () => render(searchInput.value.trim()));
}

// 调用函数，启动加载
loadNovels();
