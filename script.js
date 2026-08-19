function trackEvent(eventName, params) {
  if (typeof window.nkTrack === 'function') {
    window.nkTrack(eventName, params);
  }
}

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

  const trackedSectionIds = ['dores', 'solucao', 'arquitetura', 'no-ar', 'insights', 'roadmap', 'faq', 'governanca', 'contato'];
  const seenSections = new Set();
  const sectionViewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seenSections.has(entry.target.id)) return;
        seenSections.add(entry.target.id);
        trackEvent('section_view', { section: entry.target.id });
      });
    },
    { threshold: 0.45 }
  );
  trackedSectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionViewObserver.observe(section);
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="wa.me"]');
    if (!link) return;
    trackEvent('whatsapp_click', {
      source: link.getAttribute('data-nk-source') || link.id || 'link',
    });
  });

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
    if (!modal) return;
    trackEvent('diagnostico_started', {});
    modal.setAttribute('aria-hidden', 'false');
    if (abrirBtn) abrirBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function fecharModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    if (abrirBtn) abrirBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (abrirBtn && modal && !abrirBtn.hasAttribute('data-open-diagnostico')) {
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
          'Comece pelo mapa territorial e pela carteira no ONE: gaps de cidade, ranking de potencial e comparativo de representantes já estão no ar.';
      } else if (objetivo === 'prever_riscos') {
        recomendacao =
          'Use a camada preditiva já disponível: previsão de vendas, churn e anomalias, com narrativas explicáveis para a liderança comercial.';
      } else {
        recomendacao =
          'Ative a prescritiva (carteira, mix/foco e plano semanal). Quando a recomendação virar execução, o plano segue no KPI System, com responsável e prazo.';
      }

      const dorLabelMap = {
        territorios_sem_venda: 'Regiões ou cidades sem venda visível',
        baixa_previsibilidade: 'Previsibilidade baixa',
        foco_ineficiente: 'Mix e foco comercial ineficientes',
        risco_churn: 'Risco de churn ou perda de carteira',
      };
      const dadosLabelMap = {
        sap: 'SAP (incluindo HANA)',
        outro_erp: 'Outro ERP',
        manual: 'Carga manual / planilhas',
      };
      const objetivoLabelMap = {
        mapear_oportunidades: 'Mapear gaps territoriais e carteira',
        prever_riscos: 'Prever vendas, churn e tendência',
        recomendacoes: 'Gerar próxima ação e plano no KPI',
      };

      const resumo = `Dor: ${dorLabelMap[dor]} | Dados: ${dadosLabelMap[dados]} | Objetivo: ${objetivoLabelMap[objetivo]}`;
      const ingestaoNota =
        dados === 'manual'
          ? ' Com carga manual, o primeiro passo é organizar o recorte mínimo (faturamento, clientes, produtos e metas) antes de ampliar automações.'
          : '';
      texto.textContent = `${recomendacao}${ingestaoNota}`;

      const msg = encodeURIComponent(
        `Olá, quero avançar com o diagnóstico do ONE NorthKeep. ${resumo}.`
      );
      linkWpp.href = `https://wa.me/554731500001?text=${msg}`;

      trackEvent('diagnostico_completed', { dor, dados, objetivo });
      resultado.hidden = false;
    });
  }
});
