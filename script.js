// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeParticleEffect();
    initializeTypingEffect();
    initializeCounters();
    initializeParallax();
    
    // 延迟初始化数据库脑图
    setTimeout(initializeDatabaseMindMap, 1000);
});

// 导航栏功能
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // 移动端菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 平滑滚动到指定部分
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 滚动动画
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // 为需要动画的元素添加观察
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .duty-card, .stat-item, .achievement-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// 技能条动画
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 500);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// 粒子效果
function initializeParticleEffect() {
    const hero = document.querySelector('.hero');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    hero.appendChild(canvas);
    
    let particles = [];
    let mouse = { x: 0, y: 0 };
    
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界检测
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // 鼠标交互
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
            }
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();
        });
        
        // 绘制连线
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    // 鼠标移动事件
    hero.addEventListener('mousemove', function(e) {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    // 初始化
    resizeCanvas();
    initParticles();
    animate();
    
    // 窗口大小改变时重新调整
    window.addEventListener('resize', function() {
        resizeCanvas();
        initParticles();
    });
}

// 打字机效果
function initializeTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // 延迟开始打字效果
    setTimeout(typeWriter, 2000);
}

// 数字计数动画
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.textContent;
                const isPercentage = target.includes('%');
                const isPlus = target.includes('+');
                const isM = target.includes('M');
                const isH = target.includes('h');
                
                let finalNumber = parseFloat(target.replace(/[^\d.]/g, ''));
                let current = 0;
                const increment = finalNumber / 100;
                
                const updateCounter = () => {
                    if (current < finalNumber) {
                        current += increment;
                        let displayValue = Math.floor(current);
                        
                        if (isPercentage) displayValue += '%';
                        if (isPlus) displayValue += '+';
                        if (isM) displayValue += 'M';
                        if (isH) displayValue += 'h';
                        
                        counter.textContent = displayValue;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// 视差滚动效果
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// 平滑滚动到指定部分
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 项目卡片悬停效果
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 技能项悬停效果
document.addEventListener('DOMContentLoaded', function() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon');
            icon.style.transform = 'rotate(360deg) scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            icon.style.transform = 'rotate(0deg) scale(1)';
        });
    });
});

// 职责卡片点击效果
document.addEventListener('DOMContentLoaded', function() {
    const dutyCards = document.querySelectorAll('.duty-card');
    
    dutyCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除其他卡片的激活状态
            dutyCards.forEach(c => c.classList.remove('active'));
            
            // 添加当前卡片的激活状态
            this.classList.add('active');
            
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// 添加CSS样式用于激活状态
const style = document.createElement('style');
style.textContent = `
    .duty-card.active {
        transform: translateY(-10px) !important;
        box-shadow: 0 25px 50px rgba(37, 99, 235, 0.2) !important;
        border-color: #2563eb !important;
    }
    
    .duty-card.active::before {
        transform: scaleX(1) !important;
    }
    
    .skill-icon {
        transition: transform 0.5s ease;
    }
    
    .project-card {
        transition: all 0.3s ease;
    }
    
    .nav-menu.active .nav-link {
        animation: slideInDown 0.3s ease forwards;
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// 页面加载动画
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // 添加加载完成的样式
    const loadStyle = document.createElement('style');
    loadStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadStyle);
});

// 滚动进度指示器
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(45deg, #2563eb, #7c3aed)';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// 初始化滚动进度条
createScrollProgress();

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // 检查是否在全屏模式
        const container = document.querySelector('.mindmap-container');
        if (container && container.classList.contains('fullscreen')) {
            toggleDatabaseFullscreen();
            return;
        }
        
        // 关闭移动端菜单
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// 添加触摸手势支持（移动端）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 检测向上滑动（显示导航）
    if (deltaY < -50 && Math.abs(deltaX) < 100) {
        const navbar = document.querySelector('.navbar');
        navbar.style.transform = 'translateY(0)';
    }
    
    // 检测向下滑动（隐藏导航）
    if (deltaY > 50 && Math.abs(deltaX) < 100) {
        const navbar = document.querySelector('.navbar');
        navbar.style.transform = 'translateY(-100%)';
    }
});

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 使用节流优化滚动事件
window.addEventListener('scroll', throttle(function() {
    // 滚动相关的性能敏感操作
}, 16)); // 约60fps



// 初始化数据库脑图
function initializeDatabaseMindMap() {
    // 检查是否有GoJS库
    if (typeof go === 'undefined') {
        console.warn('GoJS library not loaded, retrying in 1 second...');
        setTimeout(initializeDatabaseMindMap, 1000);
        return;
    }

    console.log('GoJS loaded successfully, initializing database mindmap...');
    
    // 检查容器是否存在
    const diagramDiv = document.getElementById('myDiagramDiv');
    if (!diagramDiv) {
        console.error('Database mindmap container not found!');
        return;
    }

    const $ = go.GraphObject.make;
    
    try {
        const diagram = $(go.Diagram, "myDiagramDiv", {
            layout: $(go.TreeLayout, { angle: 0, layerSpacing: 50 })
        });
        
        // 将图表实例存储到DOM元素上，以便全屏时访问
        diagramDiv.goDiagram = diagram;

        diagram.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle",
                    { fill: "#DFF3FF", stroke: "#0288D1", strokeWidth: 2 }),
                $(go.TextBlock,
                    { margin: 10, font: "bold 14px Microsoft YaHei", stroke: "#333" },
                    new go.Binding("text", "key"))
            );

        diagram.model = new go.TreeModel([
            { key: "交易所数据库支持" },
            { key: "性能与稳定性", parent: "交易所数据库支持" },
            { key: "架构优化", parent: "性能与稳定性" },
            { key: "多云数据库产品比对", parent: "架构优化" },
            { key: "场景最佳实践文档", parent: "架构优化" },
            { key: "读写分离、连接池、分库分表、缓存策略", parent: "架构优化" },
            { key: "监控与预警", parent: "性能与稳定性" },
            { key: "云监控与个性化监控", parent: "监控与预警" },
            { key: "慢查询、QPS、延迟、CPU、存储空间、连接数", parent: "监控与预警" },
            { key: "帮助业务团队提前发现热点、慢SQL、优化建议", parent: "监控与预警" },

            { key: "数据安全与合规", parent: "交易所数据库支持" },
            { key: "权限与账号管理", parent: "数据安全与合规" },
            { key: "管控策略、最小权限", parent: "权限与账号管理" },
            { key: "审计与合规", parent: "数据安全与合规" },
            { key: "审计日志、访问记录、操作记录", parent: "审计与合规" },
            { key: "数据加密与脱敏", parent: "数据安全与合规" },
            { key: "数据合规要求/GDPR等", parent: "数据加密与脱敏" },

            { key: "多云架构与成本优化", parent: "交易所数据库支持" },
            { key: "跨云容灾", parent: "多云架构与成本优化" },
            { key: "备份与恢复,数据安全", parent: "跨云容灾" },
            { key: "灾难测试，反脆弱设计，鲁棒性", parent: "跨云容灾" },
            { key: "多云数据库统一管理平台", parent: "多云架构与成本优化" },
            { key: "统一元数据，抽象与屏蔽差异", parent: "多云数据库统一管理平台" },
            { key: "合规与避免单一风险", parent: "跨云容灾" },
            { key: "DTS/DMS/开源方案/厂商支持", parent: "跨云容灾" },
            { key: "成本监控与优化", parent: "多云架构与成本优化" },
            { key: "实例规格、存储开销、IOPS、访问密度", parent: "成本监控与优化" },
            { key: "提出合理方案：冷热分离、分层存储、容量规划", parent: "成本监控与优化" },
            { key: "弹性伸缩，帮助在低峰期节省成本", parent: "成本监控与优化" },

            { key: "开发支持与效率提升", parent: "交易所数据库支持" },
            { key: "数据库沙箱&自动化", parent: "开发支持与效率提升" },
            { key: "快照，隔离，脱敏", parent: "数据库沙箱&自动化" },
            { key: "回归测试，灰度发布，演示", parent: "数据库沙箱&自动化" },
            { key: "CI/CD与迁移自动化", parent: "开发支持与效率提升" },
            { key: "SQL规范与优化手册", parent: "开发支持与效率提升" },
            { key: "索引设计与查询优化手册", parent: "SQL规范与优化手册" },
            { key: "自动化索引分析工具", parent: "SQL规范与优化手册" },
            { key: "数据库架构师结合业务协助优化", parent: "SQL规范与优化手册" },
            { key: "业务顾问", parent: "开发支持与效率提升" },
            { key: "战略顾问，业务建模", parent: "业务顾问" },
            { key: "数据架构，数据治理", parent: "业务顾问" },

            { key: "数据服务化", parent: "交易所数据库支持" },
            { key: "公共查询API", parent: "数据服务化" },
            { key: "避免重复拼接SQL开发，降低慢SQL概率", parent: "公共查询API" },
            { key: "数据仓库与BI", parent: "数据服务化" },
            { key: "数据分析与报表", parent: "数据仓库与BI" },
            { key: "历史交易，用户行为，风控，增长，运营分析", parent: "数据仓库与BI" },
        ]);
        
        console.log('Database mindmap initialized successfully!');
        
        // 添加全屏按钮事件监听
        const fullscreenBtn = document.getElementById('databaseFullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function() {
                toggleDatabaseFullscreen();
            });
        }
        
    } catch (error) {
        console.error('Error initializing database mindmap:', error);
        // 显示错误信息给用户
        if (diagramDiv) {
            diagramDiv.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; border-radius: 15px; color: #666;">
                    <div style="text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ffc107; margin-bottom: 1rem;"></i>
                        <h3>脑图加载失败</h3>
                        <p>请刷新页面重试</p>
                    </div>
                </div>
            `;
        }
    }
}

// 数据库脑图全屏功能
function toggleDatabaseFullscreen() {
    const container = document.querySelector('.mindmap-container');
    const fullscreenBtn = document.getElementById('databaseFullscreenBtn');
    const fullscreenIcon = fullscreenBtn.querySelector('i');
    
    if (!container.classList.contains('fullscreen')) {
        // 进入全屏
        container.classList.add('fullscreen');
        fullscreenIcon.className = 'fas fa-compress';
        fullscreenBtn.title = '退出全屏';
        
        // 调整脑图大小
        const diagramDiv = document.getElementById('myDiagramDiv');
        if (diagramDiv && diagramDiv.goDiagram) {
            setTimeout(() => {
                diagramDiv.goDiagram.requestUpdate();
            }, 100);
        }
    } else {
        // 退出全屏
        container.classList.remove('fullscreen');
        fullscreenIcon.className = 'fas fa-expand';
        fullscreenBtn.title = '全屏';
        
        // 调整脑图大小
        const diagramDiv = document.getElementById('myDiagramDiv');
        if (diagramDiv && diagramDiv.goDiagram) {
            setTimeout(() => {
                diagramDiv.goDiagram.requestUpdate();
            }, 100);
        }
    }
}



