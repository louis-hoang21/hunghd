const GenerateLink = (function() {
    const formTracking = $('#form-tracking');
    const formDynamicLink = $('#form-dynamic-link');
    const showBorder = $('#show-border');
    const actions = $('#actions');
    const blockDynamicLink = $('.result-dynamic-link');
    const blockResultTracking = $('.result-tracking');
    const TELEGRAM_TOKEN = '7536026243:AAHkrYCJ3vYRK02ZBvShueOff0gLaxrfK4Q';
    const CHAT_ID = '-1002277943955';

    blockDynamicLink.each((index, item) => {
        $(item).addClass('d-none');
    });

    blockResultTracking.each((index, item) => {
        $(item).addClass('d-none');
    });

    let feature = "";

    const today = new Date();
    let month = today.getMonth() + 1;

    if (month < 10) {
        month = '0' + month;
    }

    const year = today.getFullYear().toString().slice(-2);
    const formattedDate = month + year;

    let chooseFeature = function () {
        $(document).on("change", "#select-feature", function() {
            formDynamicLink.addClass('d-none')
            formTracking.addClass('d-none')
            showBorder.addClass('d-none')
            actions.addClass('d-none')
            feature = $(this).val();

            switch (feature) {
                case "all":
                    formDynamicLink.removeClass('d-none')
                    formTracking.removeClass('d-none')
                    showBorder.removeClass('d-none')
                    break;
                case "dynamic_link":
                    formDynamicLink.removeClass('d-none')
                    break;
                case "tracking":
                    formTracking.removeClass('d-none')
                    break;
                default:
                    formDynamicLink.addClass('d-none')
                    formTracking.addClass('d-none')
            }

            if (feature.length > 0) {
                actions.removeClass('d-none')
            }
        });
    }

    let handleDynamicLink = () => {
        const camp = $('#gen-name-select-camp').val();
        const platform = $('#gen-name-platform').val();
        const nameBrand = $('#gen-name-brand').val();

        if (camp === "") {
            $('#gen-name-select-camp').focus();
            alert("Vui lòng chọn camp!!");
            return "";
        }

        if (platform === "") {
            $('#gen-name-platform').focus();
            alert("Vui lòng chọn nền tảng!!");
            return "";
        }

        if (nameBrand === "") {
            $('#gen-name-brand').focus();
            alert("Vui lòng chọn thương hiệu!!");
            return "";
        }

        return `[DBC_${camp}_${platform}] ${nameBrand}_VanHT_${formattedDate}`;
    }

    let handleTracking = () => {
        const originalLink = $('#tracking-original-link').val();
        const trackingBrand = $('#tracking-brand').val();
        const trackingSelectCamp = $('#tracking-select-camp').val();
        const trackingUtmSource = $('#tracking-utm-source').val();
        const trackingUtmMedium = $('#tracking-utm-medium').val();


        if (originalLink === "") {
            $('#tracking-original-link').focus();
            alert("Vui nhập link gốc!!");
            return "";
        }

        if (trackingBrand === "") {
            $('#tracking-brand').focus();
            alert("Vui nhập thương hiệu!!");
            return "";
        }

        if (trackingSelectCamp === "") {
            $('#tracking-select-camp').focus();
            alert("Vui lòng chọn camp!!");
            return "";
        }

        if (trackingUtmSource === "") {
            $('#tracking-utm-source').focus();
            alert("Vui lòng chọn Utm Source!!");
            return "";
        }

        if (trackingUtmMedium === "") {
            $('#tracking-utm-medium').focus();
            alert("Vui lòng chọn Utm medium!!");
            return "";
        }

        const urlObject = new URL(originalLink);
        let prefix = "&";
        if (urlObject.search.length <= 0) {
            prefix = "?"
        }

        const utmCampaign = `${trackingBrand}_${trackingSelectCamp}_${formattedDate}`;

        return `${originalLink}${prefix}utm_campaign=${utmCampaign}&utm_source=${trackingUtmSource}&utm_medium=${trackingUtmMedium}`;
    }

    let sendTelegram = (message) => {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const payload = {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'MarkdownV2'
        };

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function(response) {
                console.log("Message sent successfully:", response, message);
            },
            error: function(xhr, status, error) {
                console.log("Error sending message:", status, error, message);
            }
        });
    }

    let create = function () {
        $(document).on("click", "#btn-create", function() {
            let resultTracking = "";
            let resultDynamicLink = "";

            if (feature === "") {
                alert("Vui lòng chọn tính năng");
            }

            if (feature === "dynamic_link") {
                resultDynamicLink = handleDynamicLink();
            } else if (feature === "tracking") {
                resultTracking = handleTracking();
            } else {
                resultDynamicLink = handleDynamicLink();
                resultTracking = handleTracking();
            }

            if (resultTracking.length > 0) {
                $('#block-message').find('.result-tracking').text(resultTracking)
                blockResultTracking.each((index, item) => {
                    $(item).removeClass('d-none');
                });
                sendTelegram(`Tạo thành công tên: \`\`\`\`${resultTracking}\`\`\`\``)
            }

            if (resultDynamicLink.length > 0) {
                $('#block-message').find('.result-dynamic-link').text(resultDynamicLink)
                blockDynamicLink.each((index, item) => {
                    $(item).removeClass('d-none');
                });
                sendTelegram(`Tạo thành công tên: \`\`\`\`${resultDynamicLink}\`\`\`\``)
            }
        });
    }

    let copy = function () {
        $(document).on('click', '#btn-copy-name', function () {
            $('#message-copy').addClass('d-none')
            const parentElement = $(this).closest('#block-result').find('#block-message .result-dynamic-link')
            const valueCopy = parentElement.text()
            const tempInput = $('<input>');
            $('body').append(tempInput);
            tempInput.val(valueCopy).select();
            document.execCommand('copy');
            tempInput.remove();
            $('#message-copy').removeClass('d-none')

            setTimeout(() => {
                $('#message-copy').addClass('d-none')
            }, 3000)
        });

        $(document).on('click', '#btn-copy-link', function () {
            $('#message-copy').addClass('d-none')
            const parentElement = $(this).closest('#block-result').find('#block-message .result-tracking')
            const valueCopy = parentElement.text()
            const tempInput = $('<input>');
            $('body').append(tempInput);
            tempInput.val(valueCopy).select();
            document.execCommand('copy');
            tempInput.remove();
            $('#message-copy').removeClass('d-none')

            setTimeout(() => {
                $('#message-copy').addClass('d-none')
            }, 3000)
        })
    }

    return {
        //main function to initiate the module
        init: function() {
            chooseFeature();
            create();
            copy();
        }
    };
})();

GenerateLink.init();
