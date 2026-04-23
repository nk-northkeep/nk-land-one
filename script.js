document.addEventListener('DOMContentLoaded', () => {
  const stickyNavs = document.querySelectorAll('[data-sticky-nav]');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('menu-principal');
  const openDiagnosticoButtons = document.querySelectorAll('[data-open-diagnostico]');
  const sectionNavLinks = navLinks
    ? Array.from(navLinks.querySelectorAll('a[href^="#"]')).filter((link) => {
        const href = link.getAttribute('href');
        return href && href !== '#' && document.querySelector(href);
      })
    : [];

  if (stickyNavs.length) {
    const toggleStickyNav = () => {
      const isScrolled = window.scrollY > 12;
      stickyNavs.forEach((nav) => {
        nav.classList.toggle('is-sticky', isScrolled);
      });
    };

    toggleStickyNav();
    window.addEventListener('scroll', toggleStickyNav, { passive: true });
  }

  if (sectionNavLinks.length) {
    const trackedSections = sectionNavLinks
      .map((link) => {
        const selector = link.getAttribute('href');
        const section = selector ? document.querySelector(selector) : null;
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    const setActiveSectionLink = (activeId = '') => {
      trackedSections.forEach(({ link, section }) => {
        const isActive = section.id === activeId;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const updateActiveSectionLink = () => {
      const activationOffset = 160;
      const scrollPosition = window.scrollY + activationOffset;
      let activeId = '';

      trackedSections.forEach(({ section }) => {
        if (section.offsetTop <= scrollPosition) {
          activeId = section.id;
        }
      });

      setActiveSectionLink(activeId);
    };

    updateActiveSectionLink();
    window.addEventListener('scroll', updateActiveSectionLink, { passive: true });
    window.addEventListener('resize', updateActiveSectionLink);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('is-open', !expanded);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      });
    });
  }

  // Reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Diagnóstico Rápido modal
  const abrirBtn = document.getElementById('abrir-diagnostico');
  const modal = document.getElementById('diagnostico');
  const fecharBtn = document.getElementById('fechar-diagnostico');
  const form = document.getElementById('diagnostico-form');
  const resultado = document.getElementById('diagnostico-resultado');
  const texto = document.getElementById('diagnostico-texto');
  const linkWpp = document.getElementById('diagnostico-whatsapp');

  function abrirModal() {
    if (!modal || !abrirBtn) return;
    modal.setAttribute('aria-hidden', 'false');
    abrirBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function fecharModal() {
    if (!modal || !abrirBtn) return;
    modal.setAttribute('aria-hidden', 'true');
    abrirBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (abrirBtn && modal) {
    abrirBtn.addEventListener('click', abrirModal);
  }
  if (fecharBtn) {
    fecharBtn.addEventListener('click', fecharModal);
  }
  openDiagnosticoButtons.forEach((button) => {
    button.addEventListener('click', abrirModal);
  });
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') {
      fecharModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const dor = form.elements.dor.value;
      const dados = form.elements.dados.value;
      const objetivo = form.elements.objetivo.value;

      let recomendacao = '';
      if (objetivo === 'mapear_oportunidades') {
        recomendacao =
          'Comece por um mapa de oportunidades e gargalos, consolidando indicadores críticos, comparativos e sinais de prioridade em um único painel executivo.';
      } else if (objetivo === 'prever_riscos') {
        recomendacao =
          'Implemente uma camada de previsibilidade com alertas de risco, tendência e anomalias. Use modelos explicáveis para comunicar causas e orientar ações antecipadas.';
      } else {
        recomendacao =
          'Ative recomendações prescritivas com priorização de ações, filas e responsáveis para acelerar resposta operacional e tomada de decisão.';
      }

      const dorLabelMap = {
        visibilidade_fragmentada: 'Baixa visibilidade e dados fragmentados',
        baixa_previsibilidade: 'Previsibilidade baixa',
        priorizacao_ineficiente: 'Priorização ineficiente entre áreas',
        risco_operacional: 'Risco operacional ou perda crítica',
      };
      const dadosLabelMap = { alto: 'Alto (ERP/BI/CRM)', medio: 'Médio', baixo: 'Baixo' };
      const objetivoLabelMap = {
        mapear_oportunidades: 'Mapear oportunidades e gargalos',
        prever_riscos: 'Prever riscos e tendências',
        recomendacoes: 'Gerar recomendações priorizadas',
      };

      const resumo = `Dor: ${dorLabelMap[dor]} | Dados: ${dadosLabelMap[dados]} | Objetivo: ${objetivoLabelMap[objetivo]}`;
      texto.textContent = `${recomendacao} ${dados === 'baixo' ? 'O primeiro passo recomendado é estruturar uma base mínima confiável antes de ampliar automações.' : ''}`;

      const msg = encodeURIComponent(
        `Olá, quero avançar com o Diagnóstico de IA Estratégica. ${resumo}.`
      );
      linkWpp.href = `https://wa.me/5547999958705?text=${msg}`;

      resultado.hidden = false;
    });
  }
});
