import { Permissions, VerbosityLevel } from "../../../utils/Interfaces.mjs";

/** Timestamp of the last rule message sent */
let lastRuleSentTime = 0;
const COOLDOWN_DURATION = 5_000;

export default {
  name: ["rule", "r"],
  description: "Send a BingoBrewers rule in party chat or a Splasher rule in whispers.",
  usage: "!p rule [splasher] [number]",
  permission: Permissions.ExSplasher,

  /**
   *
   * @param {import("../../Bot.mjs").default} bot
   * @param {String} sender
   * @param {Array<String>} args
   */
  execute: async function (bot, sender, args) {
    const currentTime = Date.now();

    if (currentTime - lastRuleSentTime < COOLDOWN_DURATION) {
      bot.reply(sender, `Rule command is on cooldown!`, VerbosityLevel.Reduced);
      return;
    }

    lastRuleSentTime = currentTime;

    let splasher;
    if (args[0] === "splasher" || args[0] === "s") {
      splasher = args[0];
    }
    
    if (splasher && args.length < 2) {
      return bot.reply(sender, `When querying a Splasher rule, you must provide a number (1-5).`, VerbosityLevel.Reduced);
    }
    
    let rule;
    if (!splasher) {
      if (!args[0]) {
        rule = bot.utils.rulesList["1"];
      } else {
        rule = bot.utils.rulesList[args[0]];
      }
    } else {
      rule = bot.utils.splasherRulesList[args[1]];
    }

    let ruleNum;
    if (!splasher) {
      ruleNum = Object.keys(bot.utils.rulesList).find(
        (key) => bot.utils.rulesList[key] === rule,
      );
    } else {
      ruleNum = Object.keys(bot.utils.splasherRulesList).find(
        (key) => bot.utils.splasherRulesList[key] === rule,
      );
    }

    // TODO: update rules (both data & usage system/mechanism)
    // bot.chat("/pc --- Bingo Brewers Rules (Outdated)---");
    if (!splasher) {
      bot.chat("/pc --- Bingo Brewers Rules ---", VerbosityLevel.Minimal);
      await bot.utils.delay(bot.utils.minMsgDelay);
      bot.chat(`/pc Rule ${ruleNum}: ${rule}`, VerbosityLevel.Minimal);
    } else {
      return bot.reply(sender, `Splasher Rule ${ruleNum}: ${rule}`, VerbosityLevel.Minimal);
    }
  },
};
