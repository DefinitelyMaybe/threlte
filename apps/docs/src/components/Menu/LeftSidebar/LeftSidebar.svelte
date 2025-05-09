<script lang="ts">
  import LeftSidebarCategory from './LeftSidebarCategory.svelte'

  interface Props {
    menu: Record<'learn' | 'reference' | 'examples', LeftSidebarMenu>
    activeSidebarTab: 'learn' | 'reference' | 'examples'
    activeUrlPathName: string
  }

  let { menu, activeSidebarTab, activeUrlPathName }: Props = $props()
</script>

<nav class="relative hidden h-full w-full pl-6 pr-2 md:block">
  <ul
    id="sidebar-scrollwindow"
    class="mt-0 block h-full overflow-x-hidden overflow-y-scroll pb-24 lg:pt-6"
  >
    {#each menu[activeSidebarTab].categories as category}
      <li class="mb-6 text-sm">
        <LeftSidebarCategory
          {category}
          {activeUrlPathName}
        />
      </li>
    {/each}
  </ul>
</nav>
