import type { Language } from "@pancakeswap/localization";
import noop from "lodash/noop";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { SubMenuItemsType } from "../../components";
import { footerLinks } from "../../components/Footer/config";
import { renderWithProvider } from "../../testHelpers";
import { Menu, menuConfig } from "../../widgets/Menu";

/**
 * @see https://jestjs.io/docs/en/manual-mocks
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `en${i}-locale`,
}));

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <BrowserRouter>
      <Menu
        chainId={56}
        isDark={false}
        toggleTheme={noop}
        langs={langs}
        setLang={noop}
        currentLang="en-US"
        cakePriceUsd={0.23158668932877668}
        links={menuConfig}
        subLinks={menuConfig[0].items as SubMenuItemsType[]}
        footerLinks={footerLinks}
        activeItem="Trade"
        activeSubItem="Exchange"
        buyCakeLabel="Buy wXRP"
        buyCakeLink="/swap?outputCurrency=0xbbC9Fa4B395FeE68465C2Cd4a88cdE267a34ed2a&chainId=56"
      >
        body
      </Menu>
    </BrowserRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});
