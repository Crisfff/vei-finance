    function renderDashboard() {
      const totals = calculateTotals();

      balanceValue.textContent = formatMoney(totals.balance);
      monthIncome.textContent = formatMoney(totals.monthIncome);
      monthExpense.textContent = formatMoney(totals.monthExpense);

      summaryIncome.textContent = formatMoney(totals.monthIncome);
      summaryExpense.textContent = formatMoney(totals.monthExpense);
      monthResult.textContent = formatMoney(totals.monthBalance);

      statsBalance.textContent = formatMoney(totals.balance);
      statsCards.textContent = cards.length;
      statsIncome.textContent = formatMoney(totals.totalIncome);
      statsExpense.textContent = formatMoney(totals.totalExpense);

      const highest = Math.max(
        totals.monthIncome,
        totals.monthExpense,
        1
      );

      incomeProgress.style.width =
        `${(totals.monthIncome / highest) * 100}%`;

      expenseProgress.style.width =
        `${(totals.monthExpense / highest) * 100}%`;

      const resultPercent =
        totals.monthIncome > 0
          ? Math.min(
              (
                Math.abs(totals.monthBalance) /
                totals.monthIncome
              ) * 100,
              100
            )
          : 0;

      resultProgress.style.width = `${resultPercent}%`;

      if (
        totals.monthIncome === 0 &&
        totals.monthExpense === 0
      ) {
        resultCaption.textContent =
          "Todavía no hay movimientos este mes.";
      } else if (totals.monthBalance > 0) {
        resultCaption.textContent =
          "Este mes vas con balance positivo.";
      } else if (totals.monthBalance < 0) {
        resultCaption.textContent =
          "Este mes has gastado más de lo ingresado.";
      } else {
        resultCaption.textContent =
          "Ingresos y gastos están equilibrados.";
      }

      renderCards();
      renderTransactions();
      renderNotes();
      populateCardSelector();
      refreshIcons();
    }

    function renderCards() {
      homeCardsList.innerHTML = "";
      cardsGrid.innerHTML = "";

      if (cards.length === 0) {
        homeCardsList.innerHTML = emptyState(
          "credit-card",
          "Todavía no tienes tarjetas.<br>Crea la primera desde la pestaña Tarjetas."
        );

        cardsGrid.innerHTML = emptyState(
          "badge-plus",
          "Aquí aparecerán tus tarjetas.<br>Pulsa el botón + para crear la primera."
        );

        return;
      }

      cards.forEach((card) => {
        const totals = getCardTotals(card.id);

        const colors =
          CARD_COLORS[card.color] || CARD_COLORS.purple;

        const cardStyle = `
          --card-color-1: ${colors[0]};
          --card-color-2: ${colors[1]};
        `;

        const walletCard = document.createElement("article");
        walletCard.className = "wallet-card";
        walletCard.setAttribute("style", cardStyle);

        walletCard.innerHTML = `
          <div class="wallet-card-top">
            <div class="wallet-card-name">
              ${escapeHTML(card.name)}
            </div>

            <div class="wallet-card-number">
              •••• ${escapeHTML(card.last4 || "0000")}
            </div>
          </div>

          <div class="wallet-card-balance">
            ${formatMoney(totals.balance)}
          </div>

          <div class="wallet-card-footer">
            <span>Ingresado ${formatMoney(totals.income)}</span>
            <span>Gastado ${formatMoney(totals.expense)}</span>
          </div>
        `;

        homeCardsList.appendChild(walletCard);

        const detailCard = document.createElement("article");
        detailCard.className = "card-detail";
        detailCard.setAttribute("style", cardStyle);

        detailCard.innerHTML = `
          <div class="card-detail-header">
            <div>
              <div class="card-chip"></div>

              <h3>${escapeHTML(card.name)}</h3>
              <small>•••• ${escapeHTML(card.last4 || "0000")}</small>
            </div>

            <div class="card-color-dot"></div>
          </div>

          <div class="card-detail-balance">
            ${formatMoney(totals.balance)}
          </div>

          <div class="card-stats">
            <div class="card-stat">
              <span>Ingresado</span>
              <strong>${formatMoney(totals.income)}</strong>
            </div>

            <div class="card-stat">
              <span>Gastado</span>
              <strong>${formatMoney(totals.expense)}</strong>
            </div>
          </div>

          <div class="card-actions">
            <button
              class="small-button"
              type="button"
              data-edit-card="${card.id}"
            >
              <i data-lucide="pencil-line"></i>
              <span>Editar</span>
            </button>

            <button
              class="small-button danger"
              type="button"
              data-delete-card="${card.id}"
            >
              <i data-lucide="trash-2"></i>
              <span>Eliminar</span>
            </button>
          </div>
        `;

        cardsGrid.appendChild(detailCard);
      });
    }

    function getSortedTransactions() {
      return [...transactions].sort((a, b) => {
        const dateA =
          new Date(`${a.date}T12:00:00`).getTime();

        const dateB =
          new Date(`${b.date}T12:00:00`).getTime();

        if (dateB !== dateA) {
          return dateB - dateA;
        }

        return b.createdAt - a.createdAt;
      });
    }

    function renderTransactions() {
      const sortedTransactions = getSortedTransactions();

      const homeTransactions =
        showAllHomeTransactions
          ? sortedTransactions
          : sortedTransactions.slice(0, 5);

      renderTransactionList(
        transactionsList,
        homeTransactions
      );

      renderTransactionList(
        allTransactionsList,
        sortedTransactions
      );

      showAllButton.textContent =
        showAllHomeTransactions
          ? "Ver menos"
          : "Ver todos";

      showAllButton.classList.toggle(
        "hidden",
        sortedTransactions.length <= 5
      );
    }

    function renderTransactionList(container, items) {
      container.innerHTML = "";

      if (items.length === 0) {
        container.innerHTML = emptyState(
          "arrow-left-right",
          "Todavía no tienes movimientos.<br>Pulsa el botón + para añadir el primero."
        );

        return;
      }

      items.forEach((transaction) => {
        const isIncome = transaction.type === "income";

        const card = cards.find(
          (item) => item.id === transaction.cardId
        );

        const article = document.createElement("article");
        article.className = "transaction";

        article.innerHTML = `
          <div class="transaction-icon ${transaction.type}">
            <i
              data-lucide="${
                isIncome
                  ? "arrow-down-left"
                  : "arrow-up-right"
              }"
            ></i>
          </div>

          <div class="transaction-data">
            <div class="transaction-title">
              ${escapeHTML(
                transaction.description ||
                transaction.category ||
                "Movimiento"
              )}
            </div>

            <div class="transaction-date">
              ${escapeHTML(card ? card.name : "Sin tarjeta")}
              · ${formatVisibleDate(transaction.date)}
            </div>
          </div>

          <div class="transaction-right">
            <div class="transaction-amount ${transaction.type}">
              ${isIncome ? "+" : "−"}${formatMoney(
                transaction.amount
              )}
            </div>

            <button
              class="delete-button"
              type="button"
              aria-label="Eliminar movimiento"
              data-delete-transaction="${transaction.id}"
            >
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        `;

        container.appendChild(article);
      });
    }

    function renderNotes() {
      notesList.innerHTML = "";

      const sortedNotes = [...notes].sort(
        (a, b) => b.createdAt - a.createdAt
      );

      if (sortedNotes.length === 0) {
        notesList.innerHTML = emptyState(
          "notebook-pen",
          "No tienes notas guardadas.<br>Aquí puedes apuntar pagos, ideas o recordatorios."
        );

        return;
      }

      sortedNotes.forEach((note) => {
        const article = document.createElement("article");
        article.className = "note-card";

        article.innerHTML = `
          <h3 class="note-title">
            ${escapeHTML(note.title)}
          </h3>

          <p class="note-text">
            ${escapeHTML(note.text)}
          </p>

          <div class="note-date">
            ${new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }).format(new Date(note.createdAt))}
          </div>

          <button
            class="delete-button"
            type="button"
            aria-label="Eliminar nota"
            data-delete-note="${note.id}"
          >
            <i data-lucide="trash-2"></i>
          </button>
        `;

        notesList.appendChild(article);
      });
    }

    function populateCardSelector() {
      cardInput.innerHTML = "";

      if (cards.length === 0) {
        cardInput.innerHTML = `
          <option value="">
            Primero crea una tarjeta
          </option>
        `;

        return;
      }

      cards.forEach((card) => {
        const option = document.createElement("option");
        option.value = card.id;
        option.textContent = card.name;
        cardInput.appendChild(option);
      });
    }

