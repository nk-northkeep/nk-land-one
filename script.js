function salvarOrigem(origemId) {
  localStorage.setItem('scroll_origin', origemId);
}

function scrollSuave(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    window.scrollTo({ top: targetElement.offsetTop - 50, behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const returnButtons = document.querySelectorAll('.return-button');
  returnButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSection = 'arquitetura';
      const origemId = this.getAttribute('data-target');
      scrollSuave(targetSection);
      setTimeout(() => {
        const origemElement = document.getElementById(origemId);
        if (origemElement) {
          origemElement.classList.add('highlight');
          setTimeout(() => {
            origemElement.classList.remove('highlight');
          }, 1500);
        }
      }, 800);
    });
  });

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
    modal.setAttribute('aria-hidden', 'false');
    abrirBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function fecharModal() {
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
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const dor = form.querySelector('input[name="dor"]:checked').value;
      const dados = form.querySelector('input[name="dados"]:checked').value;
      const objetivo = form.querySelector('input[name="objetivo"]:checked').value;

      let recomendacao = '';
      if (objetivo === 'mapear_oportunidades') {
        recomendacao =
          'Priorize Mapas de Oportunidades e regiões sem vendas com IPT por cidade. Entregue rapidamente um painel com gaps e ranking de potencial.';
      } else if (objetivo === 'prever_vendas') {
        recomendacao =
          'Implemente Previsão de Vendas e Detecção de Churn. Use modelos explicáveis para comunicar causas e direcionar ações antecipadas.';
      } else {
        recomendacao =
          'Ative Recomendações Prescritivas por representante, com priorização semanal de clientes e produtos para foco comercial real.';
      }

      const dorLabelMap = {
        regioes_sem_venda: 'Regiões sem vendas',
        baixa_previsibilidade: 'Previsibilidade baixa',
        foco_ineficiente: 'Foco comercial ineficiente',
        risco_churn: 'Risco de churn',
      };
      const dadosLabelMap = { alto: 'Alto (SAP/BI)', medio: 'Médio', baixo: 'Baixo' };
      const objetivoLabelMap = {
        mapear_oportunidades: 'Mapear oportunidades',
        prever_vendas: 'Prever vendas/churn',
        recomendacoes: 'Recomendações por representante',
      };

      const resumo = `Dor: ${dorLabelMap[dor]} | Dados: ${dadosLabelMap[dados]} | Objetivo: ${objetivoLabelMap[objetivo]}`;
      texto.textContent = `${recomendacao}`;

      const msg = encodeURIComponent(
        `Olá, quero avançar com o Diagnóstico IA Comercial. ${resumo}.`
      );
      linkWpp.href = `https://wa.me/5547999958705?text=${msg}`;

      resultado.hidden = false;
    });
  }
});
