// 비전모터 웹사이트 메인 JavaScript

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 모바일 메뉴 토글 기능
    const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // 햄버거 아이콘 애니메이션
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // 부드러운 스크롤 기능
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 모바일 메뉴 닫기
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
    
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들 관찰
    const animateElements = document.querySelectorAll('.fade-in-up');
    animateElements.forEach(el => observer.observe(el));
    
    // 통계 카운터 애니메이션
    const counterElements = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000; // 2초
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString() + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString() + '+';
            }
        };
        
        updateCounter();
    };
    
    // 통계 섹션이 보일 때 카운터 애니메이션 시작
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('[data-stats-section]');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // 헤더 스크롤 효과 및 플로팅 배너
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 헤더 배경 투명도 조절
        if (currentScrollY > 100) {
            header.classList.add('bg-white/95');
            header.classList.remove('bg-white');
        } else {
            header.classList.remove('bg-white/95');
            header.classList.add('bg-white');
        }
        
        // 플로팅 내비게이션 표시/숨김 (항상 표시)
        // 스크롤에 따른 추가 로직이 필요하면 여기에 추가
        
        lastScrollY = currentScrollY;
    });
    
    // 플로팅 내비게이션 기능
    const floatingNav = document.getElementById('floatingNav');
    const navItems = document.querySelectorAll('#floatingNav .nav-item');
    
    // 각 내비게이션 아이템에 클릭 이벤트 추가
    navItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // 이벤트 버블링 방지
            
            const section = this.getAttribute('data-section');
            console.log(`플로팅 네비게이션 ${index + 1}번 클릭됨:`, section);
            
            if (section) {
                // contact 섹션인 경우 contact.html로 이동
                if (section === 'contact') {
                    window.location.href = 'contact.html';
                    return;
                }
                
                const targetElement = document.getElementById(section);
                if (targetElement) {
                    console.log('대상 섹션으로 이동:', section);
                    
                    // 헤더 높이를 고려한 정확한 위치로 스크롤
                    const headerHeight = 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.warn('섹션을 찾을 수 없습니다:', section);
                }
            } else {
                console.warn('data-section 속성이 없습니다:', this);
            }
        });
    });
    
    // 맨 위로 가기 버튼
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    console.log('플로팅 내비게이션이 로드되었습니다.');
    
    // 이미지 lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 로딩 상태 관리
    window.addEventListener('load', function() {
        // 로딩 완료 후 애니메이션 초기화
        document.body.classList.add('loaded');
        
        // 이미지 에러 처리
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            img.addEventListener('error', function() {
                // 이미지 로드 실패 시 대체 이미지 또는 플레이스홀더 표시
                this.style.display = 'none';
                console.warn('이미지 로드 실패:', this.src);
            });
        });
    });
    
    // 폼 제출 처리 (연락처 폼이 있는 경우)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 여기에 폼 제출 로직 추가
            alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        });
    }
    
    // 서비스 카드 호버 효과 최적화
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 성능 모니터링
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('페이지 로드 시간:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
                }
            }, 0);
        });
    }
    
    console.log('비전모터 웹사이트가 성공적으로 로드되었습니다.');
});

// 유틸리티 함수들
const Utils = {
    // 디바이스 타입 검사
    isMobile: () => window.innerWidth <= 768,
    
    // 스크롤 위치 가져오기
    getScrollPosition: () => window.pageYOffset || document.documentElement.scrollTop,
    
    // 요소가 뷰포트에 있는지 확인
    isElementInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // 디바운싱 함수
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// 전역 객체에 Utils 추가 (필요한 경우)
window.VisionMotorUtils = Utils;