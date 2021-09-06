import {
  TailwindDialog,
  TailwindDialogPanel,
  TailwindDialogTitle,
  TailwindTransition,
  TailwindTransitionChild,
} from 'solid-headless';
import { createSignal, JSX } from 'solid-js';

export default function App(): JSX.Element {
  const [isOpen, setIsOpen] = createSignal(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div class="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          class="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>
      </div>

      <TailwindTransition appear show={isOpen()}>
        {(state) => (
          <TailwindDialog
            isOpen={state() !== 'after-leave'}
            class="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeModal}
          >
            <div class="min-h-screen px-4 flex items-center justify-center">
              <TailwindTransitionChild
                enterDuration={300}
                leaveDuration={200}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <TailwindDialogPanel class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <TailwindDialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </TailwindDialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      your an email with all of the details of your order.
                    </p>
                  </div>

                  <div class="mt-4">
                    <button
                      type="button"
                      class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </TailwindDialogPanel>
              </TailwindTransitionChild>
            </div>
          </TailwindDialog>
        )}
      </TailwindTransition>
    </>
  );
}