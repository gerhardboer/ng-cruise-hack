import { HackNightPage } from './app.po';

describe('hack-night App', () => {
  let page: HackNightPage;

  beforeEach(() => {
    page = new HackNightPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
