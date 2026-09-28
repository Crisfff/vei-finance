    entryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (currentEntryType === "note") {
        const title = noteTitleInput.value.trim();
        const text = noteTextInput.value.trim();

        if (!title || !text) {
          alert(
            "Completa el título y el contenido de la nota."
          );

          return;
        }

        notes.push({
          id: createId(),
          title,
          text,
          createdAt: Date.now()
        });
      } else {
        if (cards.length === 0) {
          alert("Primero crea una tarjeta.");
          return;
        }

        const amount = Number(amountInput.value);
        const selectedCardId = cardInput.value;
        const date = dateInput.value;

        if (!amount || amount <= 0) {
          alert("Escribe una cantidad válida.");
          return;
        }

        if (!selectedCardId) {
          alert("Selecciona una tarjeta.");
          return;
        }

        if (!date) {
          alert("Selecciona una fecha.");
          return;
        }

        transactions.push({
          id: createId(),
          type: currentEntryType,
          amount,
          cardId: selectedCardId,
          category: categoryInput.value,
          description: descriptionInput.value.trim(),
          date,
          createdAt: Date.now()
        });
      }

      saveData();
      renderDashboard();
      closeEntryModal();
    });

    cardForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = cardNameInput.value.trim();

      const initialBalance =
        Number(cardInitialInput.value) || 0;

      const last4 = cardLast4Input.value
        .replace(/\D/g, "")
        .slice(0, 4);

      const color = cardColorInput.value;

      if (!name) {
        alert("Escribe un nombre para la tarjeta.");
        return;
      }

      if (editingCardId.value) {
        const index = cards.findIndex(
          (card) => card.id === editingCardId.value
        );

        if (index !== -1) {
          cards[index] = {
            ...cards[index],
            name,
            initialBalance,
            last4,
            color
          };
        }
      } else {
        cards.push({
          id: createId(),
          name,
          initialBalance,
          last4,
          color,
          createdAt: Date.now()
        });
      }

      saveData();
      renderDashboard();
      closeCardModal();
    });

    document
      .querySelectorAll("[data-open-entry]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          openEntryModal(button.dataset.openEntry);
        });
      });

    document
      .querySelectorAll("[data-entry-type]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          setCurrentEntryType(button.dataset.entryType);
        });
      });

    document
      .querySelectorAll(".nav-button")
      .forEach((button) => {
        button.addEventListener("click", () => {
          showPage(button.dataset.page);
        });
      });

    document
      .getElementById("floatingButton")
      .addEventListener("click", () => {
        openEntryModal("income");
      });

    document
      .getElementById("addCardButton")
      .addEventListener("click", () => {
        openCardModal();
      });

    document
      .getElementById("addNoteButton")
      .addEventListener("click", () => {
        openEntryModal("note");
      });

    document
      .getElementById("showCardsButton")
      .addEventListener("click", () => {
        showPage("cardsPage");
      });

    document
      .getElementById("settingsButton")
      .addEventListener("click", openSettingsModal);

    document
      .getElementById("closeEntryModalButton")
      .addEventListener("click", closeEntryModal);

    document
      .getElementById("closeCardModalButton")
      .addEventListener("click", closeCardModal);

    document
      .getElementById("closeSettingsModalButton")
      .addEventListener("click", closeSettingsModal);

    document
      .getElementById("saveSettingsButton")
      .addEventListener("click", () => {
        currency = currencyInput.value;

        saveData();
        renderDashboard();
        closeSettingsModal();
      });

    showAllButton.addEventListener("click", () => {
      showAllHomeTransactions =
        !showAllHomeTransactions;

      renderTransactions();
      refreshIcons();
    });

    entryModalOverlay.addEventListener("click", (event) => {
      if (event.target === entryModalOverlay) {
        closeEntryModal();
      }
    });

    cardModalOverlay.addEventListener("click", (event) => {
      if (event.target === cardModalOverlay) {
        closeCardModal();
      }
    });

    settingsModalOverlay.addEventListener("click", (event) => {
      if (event.target === settingsModalOverlay) {
        closeSettingsModal();
      }
    });

    document.addEventListener("click", (event) => {
      const transactionButton =
        event.target.closest("[data-delete-transaction]");

      const noteButton =
        event.target.closest("[data-delete-note]");

      const editCardButton =
        event.target.closest("[data-edit-card]");

      const deleteCardButton =
        event.target.closest("[data-delete-card]");

      if (transactionButton) {
        if (confirm("¿Eliminar este movimiento?")) {
          deleteTransaction(
            transactionButton.dataset.deleteTransaction
          );
        }
      }

      if (noteButton) {
        if (confirm("¿Eliminar esta nota?")) {
          deleteNote(noteButton.dataset.deleteNote);
        }
      }

      if (editCardButton) {
        openCardModal(editCardButton.dataset.editCard);
      }

      if (deleteCardButton) {
        if (confirm("¿Eliminar esta tarjeta?")) {
          deleteCard(deleteCardButton.dataset.deleteCard);
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (!entryModalOverlay.classList.contains("hidden")) {
        closeEntryModal();
        return;
      }

      if (!cardModalOverlay.classList.contains("hidden")) {
        closeCardModal();
        return;
      }

      if (!settingsModalOverlay.classList.contains("hidden")) {
        closeSettingsModal();
      }
    });

    renderDashboard();
