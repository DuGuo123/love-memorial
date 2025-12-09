/* ═══════════════════════════════════════════════════════════
   情侣纪念网页 - 交互脚本
   ═══════════════════════════════════════════════════════════ */

// ===== 全局变量 =====
let currentPage = 0;
const totalPages = 16; // 首页(0) + 15个内页
let musicPlaying = false;

// ===== 页面加载完成后初始化 =====
window.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    initPage();
    setupKeyboardNavigation();
    setupTouchNavigation();
    preloadImages();
});

// ===== 初始化页面 =====
function initPage() {
    // 确保首页显示
    const homePage = document.getElementById('page0');
    if (homePage) {
        homePage.classList.add('active');
    }
}

// ===== 开始回忆之旅 =====
function startJourney() {
    console.log('开始回忆之旅');
    
    // 播放音乐（用户交互后）
    playMusic();
    
    // 跳转到第一页
    nextPage(0);
}

// ===== 翻到下一页 =====
function nextPage(fromPageNum) {
    const fromPage = document.getElementById(`page${fromPageNum}`);
    const toPage = document.getElementById(`page${fromPageNum + 1}`);
    
    if (fromPage && toPage) {
        // 淡出当前页
        fromPage.classList.remove('active');
        
        // 淡入下一页
        setTimeout(() => {
            toPage.classList.add('active');
            currentPage = fromPageNum + 1;
        }, 100);
    }
}

// ===== 返回首页 =====
function goHome() {
    console.log('返回首页');
    
    const currentPageElement = document.getElementById(`page${currentPage}`);
    const homePage = document.getElementById('page0');
    
    if (currentPageElement && homePage) {
        currentPageElement.classList.remove('active');
        
        setTimeout(() => {
            homePage.classList.add('active');
            currentPage = 0;
        }, 100);
    }
}

// ===== 音乐控制 =====
function playMusic() {
    const music = document.getElementById('bgMusic');
    const musicIcon = document.getElementById('musicIcon');
    
    if (music) {
        music.play()
            .then(() => {
                console.log('音乐播放成功');
                musicPlaying = true;
                if (musicIcon) {
                    musicIcon.textContent = '🔊';
                }
            })
            .catch(error => {
                console.log('音乐自动播放被浏览器阻止:', error);
                // 提示用户点击播放按钮
                showMusicTip();
            });
    }
}

function pauseMusic() {
    const music = document.getElementById('bgMusic');
    const musicIcon = document.getElementById('musicIcon');
    
    if (music) {
        music.pause();
        musicPlaying = false;
        if (musicIcon) {
            musicIcon.textContent = '🔇';
        }
    }
}

function toggleMusic() {
    if (musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// ===== 显示音乐播放提示 =====
function showMusicTip() {
    const musicControl = document.getElementById('musicControl');
    if (musicControl) {
        musicControl.style.animation = 'pulse 1s ease-in-out 3';
    }
}

// ===== 键盘导航 =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // 右方向键或Enter - 下一页
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (currentPage === 0) {
                startJourney();
            } else if (currentPage < totalPages - 1) {
                nextPage(currentPage);
            }
        }
        
        // 左方向键 - 上一页
        else if (e.key === 'ArrowLeft') {
            if (currentPage > 0) {
                goToPreviousPage();
            }
        }
        
        // Home或Esc - 返回首页
        else if (e.key === 'Home' || e.key === 'Escape') {
            if (currentPage !== 0) {
                goHome();
            }
        }
        
        // 空格键 - 控制音乐
        else if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            toggleMusic();
        }
    });
}

// ===== 返回上一页 =====
function goToPreviousPage() {
    const currentPageElement = document.getElementById(`page${currentPage}`);
    const prevPageElement = document.getElementById(`page${currentPage - 1}`);
    
    if (currentPageElement && prevPageElement) {
        currentPageElement.classList.remove('active');
        
        setTimeout(() => {
            prevPageElement.classList.add('active');
            currentPage--;
        }, 100);
    }
}

// ===== 触摸滑动导航（移动端） =====
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function setupTouchNavigation() {
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // 只在水平滑动时触发（避免与垂直滚动冲突）
    if (diffY < 100 && Math.abs(diffX) > swipeThreshold) {
        // 向左滑动（下一页）
        if (diffX > 0) {
            if (currentPage === 0) {
                startJourney();
            } else if (currentPage < totalPages - 1) {
                nextPage(currentPage);
            }
        }
        // 向右滑动（上一页）
        else {
            if (currentPage > 0) {
                goToPreviousPage();
            }
        }
    }
}

// ===== 图片预加载 =====
function preloadImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // 跳过装饰性背景图片
        if (img.classList.contains('float-decoration')) {
            return;
        }
        
        if (!img.complete) {
            // 创建loading效果
            img.style.opacity = '0';
            
            img.onload = function() {
                img.style.transition = 'opacity 1s ease';
                img.style.opacity = '1';
            };
            
            img.onerror = function() {
                console.warn('图片加载失败:', img.src);
                // 显示默认占位图
                img.alt = '图片加载失败，请检查文件路径';
                img.style.opacity = '1';
            };
        }
    });
}

// ===== 阻止默认的拖拽行为 =====
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// ===== 阻止右键菜单（可选，保护图片） =====
// 如果不需要此功能，可以删除以下代码
/*
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
*/

// ===== 页面可见性变化时暂停/继续音乐 =====
document.addEventListener('visibilitychange', function() {
    const music = document.getElementById('bgMusic');
    
    if (document.hidden) {
        // 页面隐藏时暂停音乐
        if (musicPlaying && music) {
            music.pause();
        }
    } else {
        // 页面显示时继续播放
        if (musicPlaying && music) {
            music.play().catch(e => console.log('恢复播放失败:', e));
        }
    }
});

// ===== 添加页面进度提示（可选） =====
function showProgress() {
    if (currentPage > 0) {
        console.log(`当前进度: ${currentPage}/${totalPages - 1}`);
    }
}

// ===== 调试信息（开发时使用，发布前可删除） =====
console.log(`
═══════════════════════════════════════
    情侣纪念网页已加载
    总页数: ${totalPages} 页
    
    快捷键说明:
    - 右方向键/Enter: 下一页
    - 左方向键: 上一页  
    - Home/Esc: 返回首页
    - 空格: 播放/暂停音乐
    
    移动端:
    - 左滑: 下一页
    - 右滑: 上一页
═══════════════════════════════════════
`);

// ===== 性能优化：节流函数 =====
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// ===== 为按钮添加点击音效（可选功能） =====
// 如需添加点击音效，可取消注释以下代码
/*
function playClickSound() {
    const clickSound = new Audio('./audio/click.mp3');
    clickSound.volume = 0.3;
    clickSound.play().catch(e => console.log('音效播放失败:', e));
}

// 给所有按钮添加点击音效
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playClickSound);
});
*/
