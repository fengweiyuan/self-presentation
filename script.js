// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeParticleEffect();
    initializeTypingEffect();
    initializeCounters();
    initializeParallax();
    initializePdfExport();
    initializeDatabaseIconClick();
    initializeMindMap();
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

// PDF导出功能
function initializePdfExport() {
    const exportBtn = document.getElementById('exportPdfBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportToPdf();
        });
    }
}

function exportToPdf() {
    // 显示加载状态
    const originalText = document.getElementById('exportPdfBtn').innerHTML;
    document.getElementById('exportPdfBtn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
    document.getElementById('exportPdfBtn').disabled = true;
    
    // 创建PDF内容
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // 设置字体
    doc.setFont('helvetica');
    
    // 页面设置
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;
    
    // 添加标题
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // 蓝色
    doc.text('个人简历 - 数据库专家', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // 添加副标题
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('OKX交易所 DBA负责人', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // 添加分隔线
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    // 联系方式
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('联系方式', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.text('邮箱: varian.feng@gmail.com', margin, yPosition);
    yPosition += 5;
    doc.text('电话: +86-13763319074', margin, yPosition);
    yPosition += 5;
    doc.text('地址: 深圳-中国', margin, yPosition);
    yPosition += 15;
    
    // 个人简介
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('个人简介', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    const introText = '拥有十三年数据库管理与架构实战经验，并深耕数据库运维平台设计开发领域，尤其在分布式 NoSQL 集群运维与数据库架构设计方向积累了深厚的技术沉淀与实战心得。曾先后担任快手数据库管控研发工程师、腾讯云数据库架构师及公有云 Redis 运维工程师，被聘为Redis 中国用户组特聘顾问。成功服务于快手、腾讯、唯品会、大疆、平安等多家行业标杆企业，为众多核心业务保驾护航。';
    const introLines = doc.splitTextToSize(introText, pageWidth - 2 * margin);
    doc.text(introLines, margin, yPosition);
    yPosition += introLines.length * 5 + 10;
    
    // 核心技能
    doc.setFontSize(12);
    doc.text('核心技能', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    const skills = [
        'MySQL (95%)',
        'PostgreSQL (90%)',
        'Redis (88%)',
        'MongoDB (85%)',
        'Docker (92%)',
        'Kubernetes (87%)',
        'Prometheus (90%)',
        'Shell/Python (93%)'
    ];
    
    skills.forEach(skill => {
        doc.text('• ' + skill, margin, yPosition);
        yPosition += 5;
    });
    yPosition += 10;
    
    // 项目经历
    doc.setFontSize(12);
    doc.text('项目经历', margin, yPosition);
    yPosition += 8;
    
    const projects = [
        {
            title: 'OKX交易系统数据库优化',
            desc: '负责OKX交易所核心交易系统的数据库架构设计与性能优化，实现99.99%的高可用性，处理峰值TPS超过100万。',
            tech: 'MySQL, Redis, 分库分表, 读写分离'
        },
        {
            title: '分布式数据库集群架构',
            desc: '设计并实施企业级分布式数据库集群，支持水平扩展，实现数据一致性保障和故障自动切换。',
            tech: 'MySQL Cluster, ProxySQL, MHA, 监控告警'
        },
        {
            title: '数据库性能调优项目',
            desc: '针对高并发场景进行深度性能调优，通过索引优化、查询重写、参数调优等手段，将查询性能提升300%。',
            tech: '慢查询分析, 索引优化, 参数调优, 缓存策略'
        },
        {
            title: '数据安全与备份策略',
            desc: '建立完善的数据安全体系，包括数据加密、访问控制、审计日志和灾难恢复方案，确保数据安全合规。',
            tech: '数据加密, 访问控制, 审计日志, 灾难恢复'
        }
    ];
    
    projects.forEach((project, index) => {
        if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(11);
        doc.setTextColor(37, 99, 235);
        doc.text(`${index + 1}. ${project.title}`, margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const descLines = doc.splitTextToSize(project.desc, pageWidth - 2 * margin);
        doc.text(descLines, margin, yPosition);
        yPosition += descLines.length * 4 + 3;
        
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`技术栈: ${project.tech}`, margin, yPosition);
        yPosition += 8;
    });
    
    // OKX职责
    if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('OKX DBA负责人职责', margin, yPosition);
    yPosition += 8;
    
    const duties = [
        '系统稳定性保障 - 7x24小时监控核心数据库系统，建立完善的故障预警机制',
        '性能优化管理 - 持续监控数据库性能指标，优化慢查询和瓶颈问题',
        '团队管理协调 - 管理DBA团队日常工作，制定技术规范和最佳实践',
        '数据安全合规 - 建立数据安全防护体系，实施数据加密和访问控制',
        '架构设计规划 - 设计高可用数据库架构，规划系统容量和扩展方案',
        '故障处理响应 - 快速响应生产环境故障，分析故障根因并制定解决方案'
    ];
    
    doc.setFontSize(9);
    duties.forEach(duty => {
        if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = margin;
        }
        doc.text('• ' + duty, margin, yPosition);
        yPosition += 5;
    });
    
    // 核心成就
    yPosition += 10;
    if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
    }
    
    doc.setFontSize(12);
    doc.text('核心成就', margin, yPosition);
    yPosition += 8;
    
    const achievements = [
        '实现99.99%的系统可用性，远超行业标准',
        '优化交易系统性能，支持百万级TPS',
        '建立完善的监控告警体系，故障响应时间<5分钟',
        '成功管理15+人的DBA团队，提升团队效率30%'
    ];
    
    doc.setFontSize(9);
    achievements.forEach(achievement => {
        doc.text('✓ ' + achievement, margin, yPosition);
        yPosition += 5;
    });
    
    // 保存PDF
    doc.save('个人简历-数据库专家.pdf');
    
    // 恢复按钮状态
    document.getElementById('exportPdfBtn').innerHTML = originalText;
    document.getElementById('exportPdfBtn').disabled = false;
}

// 数据库图标双击功能
function initializeDatabaseIconClick() {
    const databaseIcon = document.querySelector('.nav-logo i');
    const pdfBtn = document.getElementById('exportPdfBtn');
    
    let clickCount = 0;
    let clickTimeout;
    const requiredClicks = 2; // 改为双击
    const resetTime = 500; // 双击时间间隔500ms
    
    if (databaseIcon && pdfBtn) {
        databaseIcon.addEventListener('click', function() {
            clickCount++;
            
            // 添加点击动画效果
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // 清除之前的重置定时器
            clearTimeout(clickTimeout);
            
            // 如果达到要求的点击次数
            if (clickCount >= requiredClicks) {
                // 显示PDF按钮
                pdfBtn.classList.add('show');
                
                // 添加成功提示
                showClickSuccessMessage();
                
                // 重置计数
                clickCount = 0;
            } else {
                // 设置重置定时器
                clickTimeout = setTimeout(() => {
                    clickCount = 0;
                }, resetTime);
            }
        });
    }
}

// 显示点击成功提示
function showClickSuccessMessage() {
    // 创建提示消息
    const message = document.createElement('div');
    message.textContent = 'PDF导出功能已激活！';
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #007aff, #00d4ff);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
        animation: slideInRight 0.5s ease forwards;
        user-select: none;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 添加到页面
    document.body.appendChild(message);
    
    // 3秒后自动移除
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 500);
    }, 3000);
}

// 初始化脑图
function initializeMindMap() {
    // 检查是否有GoJS库
    if (typeof go === 'undefined') {
        console.warn('GoJS library not loaded');
        return;
    }

    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, "myDiagramDiv", {
        layout: $(go.TreeLayout, { 
            angle: 0, 
            layerSpacing: 80,
            nodeSpacing: 20,
            arrangement: go.TreeLayout.ArrangementHorizontal
        }),
        "undoManager.isEnabled": true,
        initialAutoScale: go.Diagram.Uniform,
        contentAlignment: go.Spot.Center,
        padding: 20
    });

    // 节点模板
    diagram.nodeTemplate =
        $(go.Node, "Auto",
            { 
                selectable: false,
                mouseEnter: function(e, obj) {
                    obj.findObject("SHAPE").fill = "#E3F2FD";
                },
                mouseLeave: function(e, obj) {
                    const level = obj.data.level || 0;
                    const colors = ["#007aff", "#1976D2", "#42A5F5", "#90CAF9", "#E3F2FD"];
                    obj.findObject("SHAPE").fill = colors[Math.min(level, colors.length - 1)];
                }
            },
            $(go.Shape, "RoundedRectangle",
                { 
                    name: "SHAPE",
                    strokeWidth: 2,
                    stroke: "#007aff"
                },
                new go.Binding("fill", "level", function(level) {
                    const colors = ["#007aff", "#1976D2", "#42A5F5", "#90CAF9", "#E3F2FD"];
                    return colors[Math.min(level || 0, colors.length - 1)];
                })
            ),
            $(go.TextBlock,
                { 
                    margin: 12, 
                    font: "bold 12px Microsoft YaHei, sans-serif", 
                    stroke: "white",
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit
                },
                new go.Binding("text", "key"),
                new go.Binding("stroke", "level", function(level) {
                    return level === 0 ? "white" : (level <= 2 ? "white" : "#333");
                })
            )
        );

    // 连接线模板
    diagram.linkTemplate =
        $(go.Link,
            { routing: go.Link.Orthogonal, corner: 5 },
            $(go.Shape, { strokeWidth: 2, stroke: "#007aff" })
        );

    // 创建节点数据并计算层级
    const nodeDataArray = [
        { key: "交易所数据库支持", level: 0 },
        
        // 第一层
        { key: "性能与稳定性", parent: "交易所数据库支持", level: 1 },
        { key: "数据安全与合规", parent: "交易所数据库支持", level: 1 },
        { key: "多云架构与成本优化", parent: "交易所数据库支持", level: 1 },
        { key: "开发支持与效率提升", parent: "交易所数据库支持", level: 1 },
        { key: "数据服务化", parent: "交易所数据库支持", level: 1 },

        // 性能与稳定性分支
        { key: "架构优化", parent: "性能与稳定性", level: 2 },
        { key: "监控与预警", parent: "性能与稳定性", level: 2 },
        
        { key: "多云数据库产品比对", parent: "架构优化", level: 3 },
        { key: "场景最佳实践文档", parent: "架构优化", level: 3 },
        { key: "读写分离、连接池、分库分表、缓存策略", parent: "架构优化", level: 3 },
        
        { key: "云监控与个性化监控", parent: "监控与预警", level: 3 },
        { key: "慢查询、QPS、延迟、CPU、存储空间、连接数", parent: "监控与预警", level: 3 },
        { key: "帮助业务团队提前发现热点、慢SQL、优化建议", parent: "监控与预警", level: 3 },

        // 数据安全与合规分支
        { key: "权限与账号管理", parent: "数据安全与合规", level: 2 },
        { key: "审计与合规", parent: "数据安全与合规", level: 2 },
        { key: "数据加密与脱敏", parent: "数据安全与合规", level: 2 },
        
        { key: "管控策略、最小权限", parent: "权限与账号管理", level: 3 },
        { key: "审计日志、访问记录、操作记录", parent: "审计与合规", level: 3 },
        { key: "数据合规要求/GDPR等", parent: "数据加密与脱敏", level: 3 },

        // 多云架构与成本优化分支
        { key: "跨云容灾", parent: "多云架构与成本优化", level: 2 },
        { key: "多云数据库统一管理平台", parent: "多云架构与成本优化", level: 2 },
        { key: "成本监控与优化", parent: "多云架构与成本优化", level: 2 },
        
        { key: "备份与恢复,数据安全", parent: "跨云容灾", level: 3 },
        { key: "灾难测试，反脆弱设计，鲁棒性", parent: "跨云容灾", level: 3 },
        { key: "合规与避免单一风险", parent: "跨云容灾", level: 3 },
        { key: "DTS/DMS/开源方案/厂商支持", parent: "跨云容灾", level: 3 },
        
        { key: "统一元数据，抽象与屏蔽差异", parent: "多云数据库统一管理平台", level: 3 },
        
        { key: "实例规格、存储开销、IOPS、访问密度", parent: "成本监控与优化", level: 3 },
        { key: "提出合理方案：冷热分离、分层存储、容量规划", parent: "成本监控与优化", level: 3 },
        { key: "弹性伸缩，帮助在低峰期节省成本", parent: "成本监控与优化", level: 3 },

        // 开发支持与效率提升分支
        { key: "数据库沙箱&自动化", parent: "开发支持与效率提升", level: 2 },
        { key: "CI/CD与迁移自动化", parent: "开发支持与效率提升", level: 2 },
        { key: "SQL规范与优化手册", parent: "开发支持与效率提升", level: 2 },
        { key: "业务顾问", parent: "开发支持与效率提升", level: 2 },
        
        { key: "快照，隔离，脱敏", parent: "数据库沙箱&自动化", level: 3 },
        { key: "回归测试，灰度发布，演示", parent: "数据库沙箱&自动化", level: 3 },
        
        { key: "索引设计与查询优化手册", parent: "SQL规范与优化手册", level: 3 },
        { key: "自动化索引分析工具", parent: "SQL规范与优化手册", level: 3 },
        { key: "数据库架构师结合业务协助优化", parent: "SQL规范与优化手册", level: 3 },
        
        { key: "战略顾问，业务建模", parent: "业务顾问", level: 3 },
        { key: "数据架构，数据治理", parent: "业务顾问", level: 3 },

        // 数据服务化分支
        { key: "公共查询API", parent: "数据服务化", level: 2 },
        { key: "数据仓库与BI", parent: "数据服务化", level: 2 },
        
        { key: "避免重复拼接SQL开发，降低慢SQL概率", parent: "公共查询API", level: 3 },
        
        { key: "数据分析与报表", parent: "数据仓库与BI", level: 3 },
        { key: "历史交易，用户行为，风控，增长，运营分析", parent: "数据仓库与BI", level: 3 }
    ];

    diagram.model = new go.TreeModel(nodeDataArray);
}
