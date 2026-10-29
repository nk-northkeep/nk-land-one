/**
 * ÚNICO BLOCO DE CONFIGURAÇÃO DA LAND.
 * Estes são os valores publicados. Uma Repository variable do GitHub só
 * substitui o campo de mesmo nome quando está preenchida; variável ausente
 * ou vazia não apaga o que está aqui.
 * ID vazio = a ferramenta não é carregada.
 *
 * GA4 (gaMeasurementId) é enviado direto pelo gtag, mesmo com o GTM no ar.
 * Não cadastre outra tag do Google / GA4 no GTM para o mesmo ID: a page_view
 * seria contada duas vezes. O GTM fica para outras tags.
 *
 */
window.NK_SITE_CONFIG = {
  siteUrl: "https://conheca.one.northkeep.com.br",
  gaMeasurementId: "G-Y7WDLTQDEJ",
  gtmContainerId: "GTM-N2HBXLDS",
  clarityProjectId: "z5bl67uqah",
  searchConsoleVerification: "",
  bingSiteVerification: "",
  metaPixelId: "2615387118898673",
  leadFormAction: "https://formspree.io/f/meaazpdb",
};
