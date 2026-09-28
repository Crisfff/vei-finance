    function showPage(pageId) {
      document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
      });

      document.querySelectorAll(".nav-button").forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.page === pageId
        );
      });

      document.getElementById(pageId).classList.add("active");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    function lockBody() {
      document.body.style.overflow = "hidden";
    }

    function unlockBody() {
      const hasOpenModal =
        !entryModalOverlay.classList.contains("hidden") ||
        !cardModalOverlay.classList.contains("hidden") ||
        !settingsModalOverlay.classList.contains("hidden");

      if (!hasOpenModal) {
        document.body.style.overflow = "";
      }
    }

    function openEntryModal(type = "income") {
      setCurrentEntryType(type);
      entryModalOverlay.classList.remove("hidden");
      lockBody();

      requestAnimationFrame(() => {
        refreshIcons(entryModalOverlay);
      });
    }

    function closeEntryModal() {
      entryModalOverlay.classList.add("hidden");

      entryForm.reset();
      dateInput.value = formatDateForInput(new Date());
      categoryInput.value = "Otros";

      unlockBody();
    }

    function setCurrentEntryType(type) {
      currentEntryType = type;

      document
        .querySelectorAll("[data-entry-type]")
        .forEach((button) => {
          button.classList.toggle(
            "active",
            button.dataset.entryType === type
          );
        });

      const isNote = type === "note";

      moneyFields.classList.toggle("hidden", isNote);
      noteFields.classList.toggle("hidden", !isNote);

      if (type === "income") {
        entryModalTitle.textContent = "Añadir ingreso";
      }

      if (type === "expense") {
        entryModalTitle.textContent = "Añadir gasto";
      }

      if (type === "note") {
        entryModalTitle.textContent = "Nueva nota";
      }
    }

    function openCardModal(cardId = "") {
      cardForm.reset();
      editingCardId.value = "";
      cardModalTitle.textContent = "Nueva tarjeta";

      if (cardId) {
        const card = cards.find((item) => item.id === cardId);

        if (!card) {
          return;
        }

        editingCardId.value = card.id;
        cardNameInput.value = card.name;
        cardInitialInput.value = card.initialBalance;
        cardLast4Input.value = card.last4;
        cardColorInput.value = card.color;

        cardModalTitle.textContent = "Editar tarjeta";
      }

      cardModalOverlay.classList.remove("hidden");
      lockBody();

      requestAnimationFrame(() => {
        refreshIcons(cardModalOverlay);
      });
    }

    function closeCardModal() {
      cardModalOverlay.classList.add("hidden");
      cardForm.reset();
      editingCardId.value = "";
      unlockBody();
    }

    function openSettingsModal() {
      currencyInput.value = currency;
      settingsModalOverlay.classList.remove("hidden");
      lockBody();

      requestAnimationFrame(() => {
        refreshIcons(settingsModalOverlay);
      });
    }

    function closeSettingsModal() {
      settingsModalOverlay.classList.add("hidden");
      unlockBody();
    }

    function deleteTransaction(id) {
      transactions = transactions.filter(
        (transaction) => transaction.id !== id
      );

      saveData();
      renderDashboard();
    }

    function deleteNote(id) {
      notes = notes.filter((note) => note.id !== id);

      saveData();
      renderDashboard();
    }

    function deleteCard(id) {
      const hasTransactions = transactions.some(
        (transaction) => transaction.cardId === id
      );

      if (hasTransactions) {
        alert(
          "Esta tarjeta tiene movimientos. Elimínalos primero."
        );

        return;
      }

      cards = cards.filter((card) => card.id !== id);

      saveData();
      renderDashboard();
    }

