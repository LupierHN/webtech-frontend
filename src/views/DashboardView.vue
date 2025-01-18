// src/views/DashboardView.vue
<script setup lang="ts">
import DocCard from '@/components/docCard.vue'
import { onMounted, ref, watch } from 'vue'
import type { Document } from '@/model/document'
import axios from 'axios'
import HeaderAPI from '@/components/HeaderAPI.vue'
import SidebarAPI from '@/components/SidebarAPI.vue'
import type { User } from '@/model/user'
import { useRoute } from 'vue-router'
import { type DismissInterface, type DismissOptions, initFlowbite, type InstanceOptions, Modal, Dismiss } from 'flowbite'

const route = useRoute()
const documents = ref<Document[]>([])
const shareError = ref('')
const owner = ref<User>()
const docId = ref<number>(0)
const username = ref<string>('')
const shared = ref<string>('')
const loadingData = ref<boolean>(false)
const sharedWith = ref<User[]>([])
let $toastSuccess: HTMLElement | null = null
let $toastDanger: HTMLElement | null = null
let $exitSuccess: HTMLElement | null = null
let $exitDanger: HTMLElement | null = null
let successDismiss: DismissInterface
let dangerDismiss: DismissInterface


async function loadData(): Promise<void> {
  try {
    loadingData.value = true
    if (route.path === '/dashboard') {
      const res = await axios.get<Document[]>('/documents/all')
      documents.value = res.data
      owner.value = JSON.parse(sessionStorage.getItem('user') || '{}')
    } else {
      if (route.params.id) {
        shared.value = route.params.id as string
        if (shared.value === 'by-me') {
          const res = await axios.get<Document[]>('/documents/shared/by')
          documents.value = res.data
        } else {
          const res = await axios.get<Document[]>('/documents/shared/with')
          documents.value = res.data
        }
      }
    }
    loadingData.value = false
  } catch (err) {
    loadingData.value = false
    console.log(err)
  }
}

onMounted(async () => {
  await loadData()
  initFlowbite()
  $toastSuccess = document.getElementById('toast-success')
  $toastDanger = document.getElementById('toast-danger')
  $exitSuccess = document.getElementById('exit-success')
  $exitDanger = document.getElementById('exit-danger')
  const options: DismissOptions = {
    transition: 'transition-opacity',
    duration: 1000,
    timing: 'ease-out'
  }
  const instanceOptionsS: InstanceOptions = {
    id: 'toast-success',
    override: true
  }
  const instanceOptionsD: InstanceOptions = {
    id: 'toast-danger',
    override: true
  }
  successDismiss = new Dismiss($toastSuccess, $exitSuccess, options, instanceOptionsS)
  dangerDismiss = new Dismiss($toastDanger, $exitDanger, options, instanceOptionsD)

})

watch(shareError, (newVal) => {
  if (newVal === 'Shared successfully' && $toastSuccess && $exitSuccess) {
    document.getElementById('toast-success')?.classList.remove('transition-opacity')
    document.getElementById('toast-success')?.classList.remove( 'duration-1000')
    document.getElementById('toast-success')?.classList.remove('ease-out')
    document.getElementById('toast-success')?.classList.remove('opacity-0')
    document.getElementById('toast-success')?.classList.remove('hidden')
  } else if (newVal !== '' && $toastDanger && $exitDanger) {
    document.getElementById('toast-danger')?.classList.remove('transition-opacity')
    document.getElementById('toast-danger')?.classList.remove( 'duration-1000')
    document.getElementById('toast-danger')?.classList.remove('ease-out')
    document.getElementById('toast-danger')?.classList.remove('opacity-0')
    document.getElementById('toast-danger')?.classList.remove('hidden')
  } else {
    if ($toastSuccess && $exitSuccess) {
      successDismiss.hide()
    }
    if ($toastDanger && $exitDanger) {
      dangerDismiss.hide()
    }
  }
  setTimeout(() => {
    shareError.value = ''
  }, 5000)
})

function showDeleteModal(id: number): void {
  docId.value = id
  const $deleteModal = document.querySelector('#popup-modal') as HTMLElement;
  const $exitDelete = document.querySelector('#exitDelete') as HTMLElement;
  const $closeDelete = document.querySelector('#closeDelete') as HTMLElement;
  const $deleteButton = document.querySelector('#deleteButton') as HTMLElement;
  if ($deleteModal && $exitDelete && $closeDelete && $deleteButton) {
    const modal = new Modal($deleteModal);

    // Remove existing event listeners
    $exitDelete.replaceWith($exitDelete.cloneNode(true));
    $closeDelete.replaceWith($closeDelete.cloneNode(true));
    $deleteButton.replaceWith($deleteButton.cloneNode(true));

    // Reassign the elements after cloning
    const newExitDelete = document.querySelector('#exitDelete') as HTMLElement;
    const newCloseDelete = document.querySelector('#closeDelete') as HTMLElement;
    const newDeleteButton = document.querySelector('#deleteButton') as HTMLElement;

    newExitDelete.addEventListener('click', () => modal.hide());
    newCloseDelete.addEventListener('click', () => modal.hide());
    newDeleteButton.addEventListener('click', () => {
      deleteDoc(id);
      modal.hide();
    });

    modal.show();
  }
}

function showShareModal(id: number): void {
  docId.value = id
  try {
    axios.get<User[]>(`/documents/shared/${id}`)
      .then(res => {
        sharedWith.value = res.data
      })
  } catch (err) {
    console.log(err)
  }
  const $shareModal = document.querySelector('#share-modal') as HTMLElement;
  const $closeShare = document.querySelector('#closeShare') as HTMLElement;
  const $shareButton = document.querySelector('#shareButton') as HTMLElement;
  if ($shareModal && $closeShare && $shareButton) {
    const modal = new Modal($shareModal);

    // Remove existing event listeners
    $closeShare.replaceWith($closeShare.cloneNode(true));
    $shareButton.replaceWith($shareButton.cloneNode(true));

    // Reassign the elements after cloning
    const newCloseShare = document.querySelector('#closeShare') as HTMLElement;
    const newShareButton = document.querySelector('#shareButton') as HTMLElement;

    newCloseShare.addEventListener('click', () => modal.hide());
    newShareButton.addEventListener('click', () => {
      shareDoc(id, username.value);
      modal.hide();
    });

    modal.show();
  }
}

async function shareDoc(id: number, username: string): Promise<void> {
  const user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
  if (username === user.username) {
    shareError.value = 'You cannot share a document with yourself'
    return
  }
  try {
    await axios.post(`/documents/share/${id}/${username}`)
    shareError.value = 'Shared successfully'
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 404) {
        shareError.value = 'User not found'
      } else if (err.response.status === 400) {
        shareError.value = 'Document already shared with this user'
      } else {
        console.log(err)
      }
    }
  }
}

watch(sharedWith, (newVal) => {
  sharedWith.value = newVal
})

async function unshare(docId: number, uId: number): Promise<void> {
  try {
    await axios.delete(`/documents/share/${docId}/${uId}`)
    sharedWith.value = sharedWith.value.filter(user => user.uId !== uId)
  } catch (err) {
    console.log(err)
  }
}

async function unshareAll(docId: number): Promise<void> {
  try {
    await axios.delete(`/documents/share/${docId}`)
    sharedWith.value = []
  } catch (err) {
    console.log(err)
  }
}

async function deleteDoc(id: number): Promise<void> {
  if (docId.value === 0) {
    return
  }
  try {
    await axios.delete(`/documents/${id}`)
    documents.value = documents.value.filter(doc => doc.docId !== id)
  } catch (err) {
    console.log(err)
  }
}

defineExpose({
  showDeleteModal,
  showShareModal,
  documents
})

</script>

<template>
  <HeaderAPI title="Header"></HeaderAPI>
  <SidebarAPI title="Sidebar"></SidebarAPI>

<!--  ShareSuccess Notification-->
  <div id="toast-success" class="hidden fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 top-14 right-5" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
      </svg>
      <span class="sr-only">Check icon</span>
    </div>
    <div class="ms-3 text-sm font-normal" v-html="shareError" ></div>
    <button id="exit-success" type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
      <span class="sr-only">Close</span>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  </div>
<!--  ShareError Notification-->
  <div id="toast-danger" class="hidden fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 top-14 right-5" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
      </svg>
      <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal" v-html="shareError" ></div>
    <button id="exit-danger" type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
      <span class="sr-only">Close</span>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  </div>

  <!--  Modal for deleting a document-->
  <div id="popup-modal" data-modal-target="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button type="button" id="closeDelete" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this document?</h3>
          <button id="deleteButton" data-modal-hide="popup-modal" :aria-description="'Delete Document ' + docId" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
            Yes, I'm sure
          </button>
          <button data-modal-hide="popup-modal" id="exitDelete" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- share modal -->
  <div id="share-modal" data-modal-target="share-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Share a document with an other user
          </h3>
          <button id="closeShare" type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="share-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="w-full max-w-md px-8 pt-4 pb-2 bg-white shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Shared with</h5>
            <button v-if="sharedWith.length > 0" id="unshareAll" @click="unshareAll(docId)" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Unshare all</button>
            <p v-else class="text-sm font-medium text-gray-500 dark:text-gray-400">No users shared with</p>
          </div>
          <div class="flow-root">
            <ul role="list" :key="sharedWith.length" class="divide-y divide-gray-200 dark:divide-gray-700">
              <li  v-for="fUser in sharedWith" :key="fUser.uId" class="py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <i class="pi pi-user text-gray-500 dark:text-gray-400"></i>
                  </div>
                  <div class="flex-1 min-w-0 ms-4">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white" v-html="fUser.firstName + ' ' + fUser.lastName" ></p>
                    <p class="text-sm text-gray-500 truncate dark:text-gray-400" v-html="fUser.username" ></p>
                  </div>
                  <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <button type="button" @click="unshare(docId, fUser.uId)" class="text-red-600 hover:text-red-800 focus:outline-none">
                      <span class="sr-only">unshare</span>
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="p-4 md:p-5 space-y-4">
          <div>
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username to share with</label>
            <input type="text" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="max2000" v-model="username" required />
          </div>
          <button type="button" id="shareButton" data-modal-hide="share-modal" :aria-description="'Share Document ' + docId" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Share document</button>
        </div>
      </div>
    </div>
  </div>

  <div class="p-4 sm:ml-64 overflow-y-scroll">
    <div class="p-4">
      <div v-if="loadingData" class="relative items-center block max-w-64 p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white opacity-20">Your documents are loading</h2>
        <p class="font-normal text-gray-700 dark:text-gray-400 opacity-20">Please wait a moment while we load your documents</p>
        <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-500 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <h1 class="dark:text-white" v-else-if="documents.length === 0">No documents found</h1>
      <div class="flex flex-wrap lg:justify-start gap-16 justify-center" v-else>
        <DocCard v-for="doc in documents" :key="doc.docId" :shared="shared" :doc="doc" @delete="showDeleteModal(doc.docId)" @share="showShareModal(doc.docId)"></DocCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
