
import {
    expect
} from 'chai';
import * as chai from 'chai'
import { XrmUiTest } from "d365-ui-test";
import * as fs from "fs";
import * as playwright from "playwright";
import * as path from "path";

import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

const xrmTest = new XrmUiTest();
let browser: playwright.Browser = null;
let context: playwright.BrowserContext = null;
let page: playwright.Page = null;

describe('Power Apps Basic UI Tests', function () {

    this.beforeAll(async () => {
        let response = await xrmTest.launch("chromium", {
            headless: false,
            args: [
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--start-fullscreen',
                '--window-position=0,0',
                '--window-size=1920,1080',
                '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"'
            ]
        });

        browser = response[0];
        context = response[1];
        page = response[2];

    })

    it("Should start D365", async () => {
        const settingsPath = path.join(__dirname, "./settings.txt");
        const settingsFound = fs.existsSync(settingsPath);
        const config = settingsFound ? fs.readFileSync(settingsPath, { encoding: 'utf-8' }) : `${process.env.CRM_URL ?? ""},${process.env.USER_NAME ?? ""},${process.env.USER_PASSWORD ?? ""},${process.env.MFA_SECRET ?? ""}`;

        const [url, user, password, mfaSecret] = config.split(",");

        await xrmTest.open(url, { userName: user, password: password, mfaSecret: mfaSecret ?? undefined });
    });

    this.afterAll(() => {
        return xrmTest.close();
    })

});


