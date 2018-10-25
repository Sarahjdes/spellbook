<!-- Copyright (c) 2018 Peter Hillerström and contributors

     This Source Code Form is subject to the terms of the Mozilla Public
     License, v. 2.0. If a copy of the MPL was not distributed with this
     file, You can obtain one at http://mozilla.org/MPL/2.0/.
   -->
<sp-close-button>
  <a ref="closeButton" class="btn btn-action btn-close btn-sm float-right">
    <i class="icon icon-cross"></i>
  </a>

  <style>
    .btn-close {
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
      z-index: 999;
    }
  </style>

  <script>
    import { events } from '../lib/events'
    const vm = this

    const onClose = (event) => {
      event.preventDefault()
      window.close()
    }

    vm.on('mount', () => {
      events.add(vm.refs.closeButton, 'click', onClose)
    })

    vm.on('unmount', () => {
      events.remove(vm.refs.closeButton, 'click', onClose)
    })
  </script>
</sp-close-button>
