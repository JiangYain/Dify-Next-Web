import { useState, useEffect, useMemo, HTMLProps, useRef } from "react";

import styles from "./settings.module.scss";
import SelectIcon from "../icons/select.svg";

import {
  Input,
  List,
  ListItem,
  Modal,
  PasswordInput,
  Popover,
  Select,
} from "./ui-lib";
import { ModelConfigList } from "./model-config";

import { IconButton } from "./button";
import {
  SubmitKey,
  useChatStore,
  Theme,
  useUpdateStore,
  useAccessStore,
  useAppConfig,
  useDifyKeyStore,
  DifySearchService,
} from "../store";

import Locale, {
  AllLangs,
  ALL_LANG_OPTIONS,
  changeLang,
  getLang,
} from "../locales";
import { Prompt } from "../store/prompt";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
export function DifyNewChat(props: { onClose?: () => void }) {
  const chatStore = useChatStore();
  const difyKeyStore = useDifyKeyStore();
  const allDifyKeys = difyKeyStore.getUserDifyKeys();
  const [searchInput, setSearchInput] = useState("");
  const [searchKeys, setSearchKeys] = useState<Prompt[]>([]);
  const difyKeys = searchInput.length > 0 ? searchKeys : allDifyKeys;
  const navigate = useNavigate();

  useEffect(() => {
    if (searchInput.length > 0) {
      const searchResult = DifySearchService.search(searchInput);
      setSearchKeys(searchResult);
    } else {
      setSearchKeys([]);
    }
  }, [searchInput]);

  return (
    <div className="modal-mask">
      <Modal
        title={Locale.Chat.SelectDifyKeyTitle}
        onClose={() => props.onClose?.()}
      >
        <div className={styles["user-prompt-modal"]}>
          <input
            type="text"
            className={styles["user-prompt-search"]}
            placeholder={Locale.Settings.DifyKeyList.Modal.Search}
            value={searchInput}
            onInput={(e) => setSearchInput(e.currentTarget.value)}
          ></input>

          <div className={styles["user-prompt-list"]}>
            {difyKeys.map((key, _) => (
              <div
                className={styles["user-prompt-item"]}
                key={key.id ?? key.title}
              >
                <div className={styles["user-prompt-header"]}>
                  <div className={styles["user-prompt-title"]}>{key.title}</div>
                  <div className={styles["user-prompt-content"] + " one-line"}>
                    {key.content}
                  </div>
                </div>

                <div className={styles["user-prompt-buttons"]}>
                  <IconButton
                    icon={<SelectIcon />}
                    className={styles["user-prompt-button"]}
                    text={Locale.Chat.SelectDifyKey}
                    onClick={() => {
                      chatStore.newSession(undefined, true, key.content);
                      props.onClose?.();
                      navigate(Path.Chat);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
