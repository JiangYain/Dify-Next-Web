import { create } from "zustand";
import { persist } from "zustand/middleware";
import Fuse from "fuse.js";
import { getLang } from "../locales";
import { StoreKey } from "../constant";

export interface DifyKey {
  id?: number;
  isUser?: boolean;
  title: string;
  content: string;
}

export interface DifyKeyStore {
  counter: number;
  latestId: number;
  difyKeys: Record<number, DifyKey>;

  add: (aDifyKey: DifyKey) => number;
  get: (id: number) => DifyKey | undefined;
  remove: (id: number) => void;
  search: (text: string) => DifyKey[];
  update: (id: number, updater: (prompt: DifyKey) => void) => void;

  getUserDifyKeys: () => DifyKey[];
}

export const DifySearchService = {
  ready: false,
  // builtinEngine: new Fuse<DifyKey>([], { keys: ["title"] }),
  userEngine: new Fuse<DifyKey>([], { keys: ["title"] }),
  count: 0,
  userDifyKeys: [] as DifyKey[],

  init(userDifyKeys: DifyKey[]) {
    if (this.ready) {
      return;
    }
    (this.userDifyKeys = userDifyKeys.slice()),
      this.userEngine.setCollection(userDifyKeys);
    this.ready = true;
  },

  remove(id: number) {
    this.userEngine.remove((doc) => doc.id === id);
  },

  add(aDifyKey: DifyKey) {
    this.userEngine.add(aDifyKey);
  },

  search(text: string) {
    const userResults = this.userEngine.search(text);
    return userResults.map((v) => v.item);
  },
};

export const useDifyKeyStore = create<DifyKeyStore>()(
  persist(
    (set, get) => ({
      counter: 0,
      latestId: 0,
      difyKeys: {},

      add(difyKey) {
        const difyKeys = get().difyKeys;
        difyKey.id = get().latestId + 1;
        difyKey.isUser = true;
        difyKeys[difyKey.id] = difyKey;

        set(() => ({
          latestId: difyKey.id!,
          difyKeys: difyKeys,
        }));

        return difyKey.id!;
      },

      get(id) {
        const targetPrompt = get().difyKeys[id];

        // if (!targetPrompt) {
        //   return SearchService.builtinPrompts.find((v) => v.id === id);
        // }

        return targetPrompt;
      },

      remove(id) {
        const difyKeys = get().difyKeys;
        delete difyKeys[id];
        DifySearchService.remove(id);

        set(() => ({
          difyKeys: difyKeys,
          counter: get().counter + 1,
        }));
      },

      getUserDifyKeys() {
        const userDifyKeys = Object.values(get().difyKeys ?? {});
        userDifyKeys.sort((a, b) => (b.id && a.id ? b.id - a.id : 0));
        return userDifyKeys;
      },

      update(id: number, updater) {
        const prompt = get().difyKeys[id] ?? {
          title: "",
          content: "",
          id,
        };

        DifySearchService.remove(id);
        updater(prompt);
        const prompts = get().difyKeys;
        prompts[id] = prompt;
        set(() => ({ difyKeys: prompts }));
        DifySearchService.add(prompt);
      },

      search(text) {
        if (text.length === 0) {
          return DifySearchService.userDifyKeys;
        }
        return DifySearchService.search(text) as DifyKey[];
      },
    }),
    {
      name: StoreKey.DifyKey,
      version: 1,
      onRehydrateStorage() {
        const PROMPT_URL = "./prompts.json";

        type PromptList = Array<[string, string]>;
        fetch(PROMPT_URL)
          .then((res) => res.json())
          .then((res) => {
            let fetchPrompts = [res.en, res.cn];
            if (getLang() === "cn") {
              fetchPrompts = fetchPrompts.reverse();
            }
            // const builtinPrompts = fetchPrompts.map(
            //   (promptList: PromptList) => {
            //     return promptList.map(
            //       ([title, content]) =>
            //         ({
            //           id: Math.random(),
            //           title,
            //           content,
            //         } as Prompt),
            //     );
          });
        setTimeout(() => {}, 2000);
        const userDifyKeys = [] as DifyKey[];
        DifySearchService.count = userDifyKeys.length;
        DifySearchService.init(userDifyKeys);
      },
    },
  ),
);
