window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const header = document.querySelector('.header');
  const burgerButton = document.querySelector('.header-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const accordionButton = document.querySelectorAll('.accordion-button');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const teamWrapper = document.querySelector('.team-cards');
  const teamCards = teamWrapper.querySelectorAll('.team-card');
  const teamWrapperShowAll = document.querySelector('.team-show-all');

  const BREAKPOINT_MOBILE = 768;
  const MOBILE_VISIBLE_CARDS = 4;
  const DESKTOP_VISIBLE_CARDS = 6;
  const HEIGHT_OFFSET = 5;

  const heightElements = [header];

  let scrollY = 0;
  const disabledScroll = () => {
    scrollY = window.scrollY;
    body.style.position = 'fixed';
    body.style.left = '0px';
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.top = `-${scrollY}px`;
  };

  const enableScroll = () => {
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    body.style.position = '';
    body.style.left = '';
    body.style.width = '';
    body.style.height = '';
    body.style.top = '';
    window.scrollTo(0, scrollY);

    setTimeout(() => {
      html.style.scrollBehavior = prevScrollBehavior || '';
    }, 0);
  };

  const setHeightElements = (element, variable) => {
    const height = Math.ceil(element.scrollHeight);
    document.documentElement.style.setProperty(
      `--${variable}-height`,
      `${height}px`
    );
  };

  const getPaddingBody = () => {
    const styles = window.getComputedStyle(body);
    const paddingTop = styles.paddingTop;
    return Math.ceil(parseFloat(paddingTop));
  };

  const setGlobalsStyles = (variable) => {
    const property = getPaddingBody();
    document.documentElement.style.setProperty(variable, `${property}px`);
  };
  setGlobalsStyles('--mobile-menu-padding');

  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;
      const variable = entry.target.dataset.height;
      setHeightElements(target, variable);
    });
  });

  heightElements.forEach((element) => {
    observer.observe(element);
  });

  const toggleMobileMenu = () => {
    if (!burgerButton) return;
    burgerButton.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      disabledScroll();
      burgerButton.setAttribute('aria-label', 'Close mobile menu');
      burgerButton.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    } else {
      enableScroll();
      burgerButton.setAttribute('aria-label', 'Open mobile menu');
      burgerButton.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  };

  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener('click', toggleMobileMenu);
  }

  const closeAccordion = (item) => {
    const button = item.querySelector('.accordion-button');
    const accordion = item.querySelector('.accordion-wrapper');
    item.classList.remove('active');
    button.classList.remove('active');
    accordion.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    accordion.setAttribute('aria-hidden', 'true');
  };

  const toggleAccordion = (button) => {
    const accordionParent = button.closest('.accordion-item');
    const accordion = accordionParent.querySelector('.accordion-wrapper');
    const isOpen = accordion.classList.contains('open');
    accordionItems.forEach((item) => closeAccordion(item));
    if (isOpen) return;
    accordion.classList.add('open');
    accordionParent.classList.add('active');
    button.classList.add('active');
    button.setAttribute('aria-expanded', 'true');
    accordion.setAttribute('aria-hidden', 'false');
  };

  if (accordionButton.length) {
    accordionButton.forEach((button) => {
      button.addEventListener('click', () => {
        toggleAccordion(button);
      });
    });
  }

  if (teamWrapper) {
    const mobile = window.innerWidth < BREAKPOINT_MOBILE;
    const cardsMobileLength = MOBILE_VISIBLE_CARDS - 1;
    const cardsDesktopLength = DESKTOP_VISIBLE_CARDS - 1;

    const setTabIndexCards = () => {
      teamCards.forEach((card) => card.setAttribute('tabindex', '0'));

      if (
        window.innerWidth <= BREAKPOINT_MOBILE &&
        teamCards.length > MOBILE_VISIBLE_CARDS
      ) {
        for (let i = MOBILE_VISIBLE_CARDS; i <= teamCards.length - 1; i++) {
          teamCards[i].setAttribute('tabindex', '-1');
        }
      } else if (
        window.innerWidth > BREAKPOINT_MOBILE &&
        teamCards.length > DESKTOP_VISIBLE_CARDS
      ) {
        for (let i = DESKTOP_VISIBLE_CARDS; i <= teamCards.length - 1; i++) {
          teamCards[i].setAttribute('tabindex', '-1');
        }
      } else {
        teamCards.forEach((card) => card.removeAttribute('tabindex'));
      }
    };

    setTabIndexCards();

    const renderAllButtonCards = () => {
      const button = document.createElement('button');
      const span = document.createElement('span');
      button.appendChild(span);
      span.textContent = 'See all team';
      button.className = 'btn btn--secondary btn--big';
      button.setAttribute('type', 'button');
      button.setAttribute('data-text', 'See all team');
      button.setAttribute('aria-controls', teamWrapper.id);
      button.setAttribute('aria-expanded', 'false');
      return button;
    };

    const showAllButtonCards = () => {
      const button = renderAllButtonCards();
      if (mobile && teamCards.length > cardsMobileLength) {
        teamWrapperShowAll.insertAdjacentElement('beforeend', button);
      } else if (!mobile && teamCards.length > cardsDesktopLength) {
        teamWrapperShowAll.insertAdjacentElement('beforeend', button);
      } else {
        return;
      }
    };

    const calcMaxHeight = () => {
      let maxHeight = 0;

      const firstElement = teamCards[0].getBoundingClientRect().top;
      const lastDesktopElement =
        teamCards[DESKTOP_VISIBLE_CARDS - 1]?.getBoundingClientRect().bottom;
      const lastMobileElement =
        teamCards[MOBILE_VISIBLE_CARDS - 1]?.getBoundingClientRect().bottom;

      if (window.innerWidth < BREAKPOINT_MOBILE) {
        maxHeight = lastMobileElement - firstElement;
      } else {
        maxHeight = lastDesktopElement - firstElement;
      }
      console.log(maxHeight);

      return maxHeight;
    };

    calcMaxHeight();

    const setMaxHeightCards = () => {
      const maxHeight = calcMaxHeight();
      if (maxHeight) {
        return (teamWrapper.style.maxHeight = `${Math.ceil(maxHeight + HEIGHT_OFFSET)}px`);
      }
    };

    window.addEventListener('load', () => {
      setMaxHeightCards();
    });

    window.addEventListener('resize', () => {
      setTabIndexCards();
    });

    const cardsObserver = new ResizeObserver(() => {
      if (!teamWrapper.classList.contains('open')) {
        setMaxHeightCards();
      }
    });
    cardsObserver.observe(teamWrapper);

    showAllButtonCards();

    const toggleCardsWrapper = (button) => {
      const buttonText = button.querySelector('span');
      teamWrapper.classList.toggle('open');
      const isOpen = teamWrapper.classList.contains('open');
      if (isOpen) {
        teamWrapper.style.maxHeight = `${teamWrapper.scrollHeight}px`;
        button.setAttribute('aria-expanded', 'true');
        buttonText.textContent = 'Hide all team';
        button.setAttribute('data-text', 'Hide all team');
        teamCards.forEach((card) => card.setAttribute('tabindex', '0'));
      } else {
        setTabIndexCards();
        setMaxHeightCards();
        button.setAttribute('aria-expanded', 'false');
        buttonText.textContent = 'See all team';
        button.setAttribute('data-text', 'See all team');
      }
    };

    teamWrapperShowAll.addEventListener('click', (event) => {
      const button = event.target.closest('.btn');
      if (button) {
        toggleCardsWrapper(button);
      }
    });
  }

  window.addEventListener('load', () => {
    AOS.init({
      duration: 800,
      once: true,
    });
  });
});
