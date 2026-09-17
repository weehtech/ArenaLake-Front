/**
 * ArenaLake — Sistema de Alternância de Tema (Dark / Light)
 * Gerenciador de tema com suporte a persistência (localStorage),
 * detecção de preferência do sistema operacional, WCAG 2.1 e eventos customizados.
 */

(function () {
  'use strict';

  const THEME_KEY = 'arenalake_theme';

  const ThemeManager = {
    /**
     * Retorna o tema ativo atual ('dark' ou 'light')
     */
    getCurrentTheme() {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    },

    /**
     * Define o tema ('dark' ou 'light') e atualiza o estado
     */
    setTheme(theme) {
      const isDark = theme === 'dark';

      // Ativa transição suave temporária
      document.documentElement.classList.add('theme-transitioning');

      if (isDark) {
        document.documentElement.classList.add('dark');
        try {
          localStorage.setItem(THEME_KEY, 'dark');
        } catch (e) {
          console.warn('Não foi possível salvar no localStorage:', e);
        }
      } else {
        document.documentElement.classList.remove('dark');
        try {
          localStorage.setItem(THEME_KEY, 'light');
        } catch (e) {
          console.warn('Não foi possível salvar no localStorage:', e);
        }
      }

      this.updateToggleButtons(isDark);

      // Dispara evento para sincronização com outros scripts (animações, canvas Three.js, etc.)
      window.dispatchEvent(
        new CustomEvent('arenaThemeChanged', {
          detail: { theme: isDark ? 'dark' : 'light', isDark }
        })
      );

      // Remove a classe de transição temporária após conclusão
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 300);
    },

    /**
     * Alterna entre os modos escuro e claro
     */
    toggleTheme() {
      const current = this.getCurrentTheme();
      this.setTheme(current === 'dark' ? 'light' : 'dark');
    },

    /**
     * Sincroniza atributos ARIA e ícones em todos os botões de alternância da página
     */
    updateToggleButtons(isDark) {
      const toggles = document.querySelectorAll('[data-theme-toggle]');
      toggles.forEach((btn) => {
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        btn.setAttribute('title', isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro');
        btn.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');

        // Ícones Sol / Lua caso estejam presentes
        const sunIcons = btn.querySelectorAll('.theme-icon-sun');
        const moonIcons = btn.querySelectorAll('.theme-icon-moon');

        sunIcons.forEach((icon) => {
          if (isDark) {
            icon.classList.remove('hidden');
          } else {
            icon.classList.add('hidden');
          }
        });

        moonIcons.forEach((icon) => {
          if (isDark) {
            icon.classList.add('hidden');
          } else {
            icon.classList.remove('hidden');
          }
        });
      });
    },

    /**
     * Inicializa os listeners de clique e eventos de sistema
     */
    init() {
      const isDark = this.getCurrentTheme() === 'dark';
      this.updateToggleButtons(isDark);

      // Listener de clique para botões com atributo data-theme-toggle
      document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-theme-toggle]');
        if (toggleBtn) {
          e.preventDefault();
          this.toggleTheme();
        }
      });

      // Listener para alterações de preferência de tema no sistema operacional
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          let savedTheme = null;
          try {
            savedTheme = localStorage.getItem(THEME_KEY);
          } catch (err) {}
          // Só altera automaticamente se o usuário não tiver salvo uma preferência explícita
          if (!savedTheme) {
            this.setTheme(e.matches ? 'dark' : 'light');
          }
        });
      }

      // Sincronização entre abas abertas simultaneamente
      window.addEventListener('storage', (e) => {
        if (e.key === THEME_KEY && e.newValue) {
          const isDarkNow = e.newValue === 'dark';
          if (isDarkNow !== document.documentElement.classList.contains('dark')) {
            if (isDarkNow) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            this.updateToggleButtons(isDarkNow);
            window.dispatchEvent(
              new CustomEvent('arenaThemeChanged', {
                detail: { theme: e.newValue, isDark: isDarkNow }
              })
            );
          }
        }
      });
    }
  };

  // Expõe no escopo global
  window.ThemeManager = ThemeManager;

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
  } else {
    ThemeManager.init();
  }
})();
