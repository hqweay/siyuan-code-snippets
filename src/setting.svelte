<script lang="ts">
  import { settings } from "@/settings";
  import { showMessage } from "siyuan";
  import { onDestroy } from "svelte";
  import SettingPanel from "./libs/setting-panel.svelte";
  import { snippets } from "./snippets";
  import InsertCSS from "./utils/insertCSS";
  import { plugin } from "./utils";
  // let groups: string[] = ["Default", "自动获取链接标题"];

  const initData = () => {
    return {
      开关: snippets.map((ele) => {
        return {
          type: "checkbox",
          title: `${ele.title} - ${ele.author && ele.link ? `@<a href= '${ele.link}'>${ele.author}</a>` : ""}`,
          description: `${ele.description}`,
          key: `${ele.author}-${ele.title}`,
          value: settings.getFlag(`${ele.author}-${ele.title}`),
          hasSetting: true,
        };
      }),
      设置: [
        {
          type: "button",
          title: "合并数据",
          description: "若某些功能无法正常使用，尝试使用此选项。",
          key: "mergeData",
          value: "确认",
        },
        {
          type: "button",
          title: "恢复/清理数据",
          description: "若合并数据后仍有问题，尝试使用此选项。",
          key: "resetData",
          value: "确认",
        },
      ],
    };
  };

  let SettingItems = initData();

  $: groups = [
    "开关",
    "设置",
    // ...SettingItems["开关"]
    //   .filter((item) => item.value === true && item.hasSetting)
    //   .map((item) => item.title),
  ];

  let focusGroup = "开关";

  /********** Events **********/
  interface ChangeEvent {
    group: string;
    key: string;
    value: any;
  }

  const onClick = async ({ detail }: CustomEvent<ChangeEvent>) => {
    if ("设置" === detail.group) {
      if ("resetData" === detail.key) {
        await settings.resetData();
        SettingItems = initData();
        showMessage("配置恢复为默认值");
      } else if ("mergeData" === detail.key) {
        await settings.mergeData();
        SettingItems = initData();
        showMessage("合并配置为最新配置");
      }
    }
  };

  const onChanged = ({ detail }: CustomEvent<ChangeEvent>) => {
    if (detail.group === "开关") {
      settings.setFlag(detail.key, detail.value);
      if (detail.value) {
        plugin.insertCss.insertSingleCSSByKey(detail.key);
      }else{
       plugin.insertCss.onunloadCSSByKey(detail.key);
      }
    } else {
      const opItem = SettingItems["开关"].filter((ele) => {
        return ele.title === detail.group;
      });
      // console.log(opItem);
      settings.setBySpace(opItem[0].key + "Config", detail.key, detail.value);
    }

    for (let index = 0; index < SettingItems[focusGroup].length; index++) {
      if (SettingItems[focusGroup][index].key === detail.key) {
        SettingItems[focusGroup][index].value = detail.value;
        break;
      }
    }
    settings.save();
    // console.log(detail);
  };

  onDestroy(async () => {
    await settings.save();
    console.log("onDestroy");
  });
</script>

<div class="fn__flex-1 fn__flex config__panel">
  <ul class="b3-tab-bar b3-list b3-list--background">
    {#each groups as group}
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <li
        data-name="editor"
        class:b3-list-item--focus={group === focusGroup}
        class="b3-list-item"
        on:click={() => {
          focusGroup = group;
          settings.save();
        }}
        on:keydown={() => {}}
      >
        <span class="b3-list-item__text">{group}</span>
      </li>
    {/each}
  </ul>
  <div class="config__tab-wrap">
    <SettingPanel
      group={focusGroup}
      settingItems={SettingItems[focusGroup]}
      on:changed={onChanged}
      on:click={onClick}
    >
      <div class="fn__flex b3-label">💡 部分功能设置后需重启插件生效.</div>
    </SettingPanel>
  </div>
</div>

<style lang="scss">
  .config__panel {
    height: 100%;
  }
  .config__panel > ul > li {
    padding-left: 1rem;
  }
</style>
