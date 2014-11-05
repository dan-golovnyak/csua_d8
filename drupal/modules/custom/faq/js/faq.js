(function ($, Drupal, drupalSettings) {

    "use strict";

    function teaser_handler(event) {
        if ($("input[name=faq_display]:checked").val() != "new_page") {
            $("input[name=faq_more_link]").prop("disabled", $("input[name=faq_use_teaser]:checked").val() != 1);
        }
    }

    function faq_display_handler(event) {
        // Enable / disable "questions_inline" and "questions_top" only settings.
        if ($("input[name=faq_display]:checked").val() == "questions_inline" || $("input[name=faq_display]:checked").val() == "questions_top") {
            $("input[name=faq_back_to_top]").prop("disabled", false);
            $("input[name=faq_qa_mark]").prop("disabled", false);
            // Enable / disable label settings according to "qa_mark" setting.
            $("input[name=faq_question_label]").prop("disabled", $("input[name=faq_qa_mark]:checked").val() != 1);
            $("input[name=faq_answer_label]").prop("disabled", $("input[name=faq_qa_mark]:checked").val() != 1);
        }
        else {
            $("input[name=faq_back_to_top]").prop("disabled", true);
            $("input[name=faq_qa_mark]").prop("disabled", true);
            $("input[name=faq_question_label]").prop("disabled", true);
            $("input[name=faq_answer_label]").prop("disabled", true);
        }

        // Enable / disable "hide_answer" only settings.
        $("input[name=faq_hide_qa_accordion]").prop("disabled", $("input[name=faq_display]:checked").val() != "hide_answer");

        // Enable / disable "new_page" only settings.
        $("input[name=faq_use_teaser]").prop("disabled", $("input[name=faq_display]:checked").val() == "new_page");
        $("input[name=faq_more_link]").prop("disabled", $("input[name=faq_display]:checked").val() == "new_page");
        $("input[name=faq_disable_node_links]").prop("disabled", $("input[name=faq_display]:checked").val() == "new_page");
        teaser_handler(event);

        // Enable / disable "new_page" and "questions_top" only settings.
        if ($("input[name=faq_display]:checked").val() == "new_page" ||
            $("input[name=faq_display]:checked").val() == "questions_top") {
            $("select[name=faq_question_listing]").prop("disabled", false);
        }
        else {
            $("select[name=faq_question_listing]").prop("disabled", true);
        }
    }

    function qa_mark_handler(event) {
        if ($("input[name=faq_display]:checked").val() == "questions_inline") {
            // Enable / disable label settings according to "qa_mark" setting.
            if ($("input[name=faq_qa_mark]:checked").val() == 1) {
                $("input[name=faq_question_label]").prop("disabled", false);
                $("input[name=faq_answer_label]").prop("disabled", false);
            }
            else {
                $("input[name=faq_question_label]").prop("disabled", true);
                $("input[name=faq_answer_label]").prop("disabled", true);
            }
        }
    }

    function questions_top_handler(event) {
        $("input[name=faq_group_questions_top]").prop("disabled", $("input[name=faq_display]").val() != "questions_top");
        $("input[name=faq_answer_category_name]").prop("disabled", $("input[name=faq_display]").val() != "questions_top");
    }

    function child_term_handler(event) {
        if ($("input[name=faq_hide_child_terms]:checked").val() == 1) {
            $("input[name=faq_show_term_page_children]").prop("disabled", true);
        }
        else if ($("input[name=faq_category_display]:checked").val() != "categories_inline") {
            $("input[name=faq_show_term_page_children]").prop("disabled", false);
        }
    }

    function categories_handler(event) {
        if ($("input[name=faq_display]").val() == "questions_top") {
            $("input[name=faq_group_questions_top]").prop("disabled", $("input[name=faq_category_display]:checked").val() != "categories_inline");
            $("input[name=faq_answer_category_name]").prop("disabled", $("input[name=faq_category_display]:checked").val() == "new_page");
        }
        else {
            $("input[name=faq_group_questions_top]").prop("disabled", true);
        }

        // Enable / disable "hide_qa" only settings.
        $("input[name=faq_category_hide_qa_accordion]").prop("disabled", $("input[name=faq_category_display]:checked").val() != "hide_qa");
        $("input[name=faq_hide_child_terms]").prop("disabled", $("input[name=faq_category_display]:checked").val() == "categories_inline");
        $("input[name=faq_show_term_page_children]").prop("disabled", $("input[name=faq_category_display]:checked").val() == "categories_inline");
        $("select[name=faq_category_listing]").prop("disabled", $("input[name=faq_category_display]:checked").val() != "new_page");

        child_term_handler();
    }

    Drupal.behaviors.initFaqModule = {
        attach: function (context, settings) {
            // Hide/show answer for a question.
            var faq_hide_qa_accordion = settings.hide_qa_accordion;
            $('div.faq-dd-hide-answer', context).addClass("collapsible collapsed");

            if (!faq_hide_qa_accordion) {
                $('div.faq-dd-hide-answer:not(.faq-processed)', context).addClass('faq-processed').hide();
            }
            $('div.faq-dt-hide-answer:not(.faq-processed)', context).addClass('faq-processed').click(function() {
                if (faq_hide_qa_accordion) {
                    $('div.faq-dt-hide-answer').not($(this)).removeClass('faq-qa-visible');
                }
                $(this).toggleClass('faq-qa-visible');
                $(this).parent().addClass('faq-viewed');
                $('div.faq-dd-hide-answer').not($(this).next('div.faq-dd-hide-answer')).addClass("collapsed");
                if (!faq_hide_qa_accordion) {
                    $(this).next('div.faq-dd-hide-answer').slideToggle('fast', function() {
                        $(this).parent().toggleClass('expanded');
                    });
                }
                $(this).next('div.faq-dd-hide-answer').toggleClass("collapsed");

                // Change the fragment, too, for permalink/bookmark.
                // To keep the current page from scrolling, refs
                // http://stackoverflow.com/questions/1489624/modifying-document-location-hash-without-page-scrolling/1489802#1489802
                var hash = $(this).find('a').attr('id');
                var fx, node = $('#' + hash);
                if (node.length) {
                    fx = $('<div></div>')
                    .css({position: 'absolute', visibility: 'hidden', top: $(window).scrollTop() + 'px'})
                    .attr('id', hash)
                    .appendTo(document.body);
                    node.attr('id', '');
                }
                document.location.hash = hash;
                if (node.length) {
                    fx.remove();
                    node.attr('id', hash);
                }

                // Scroll the page if the collapsed FAQ is not visible.
                // If we have the toolbar so the title may be hidden by the bar.
                var mainScrollTop = Math.max($('html', context).scrollTop(), $('body', context).scrollTop());
                // We compute mainScrollTop because the behaviour is different on FF, IE and CR
                if (mainScrollTop > $(this).offset().top) {
                    $('html, body', context).animate({
                        scrollTop: $(this).offset().top
                    }, 1);
                }

                return false;
            });

            // Show any question identified by a fragment
            if (/^#\w+$/.test(document.location.hash)) {
                $('div.faq-dt-hide-answer ' + document.location.hash).parents('.faq-dt-hide-answer').triggerHandler('click');
            }

            // Hide/show q/a for a category.
            var faq_category_hide_qa_accordion = settings.category_hide_qa_accordion;
            $('div.faq-qa-hide', context).addClass("collapsible collapsed");
            if (!faq_category_hide_qa_accordion) {
                $('div.faq-qa-hide', context).hide();
            }
            $('div.faq-qa-header .faq-header:not(.faq-processed)', context).addClass('faq-processed').click(function() {
                if (faq_category_hide_qa_accordion) {
                    $('div.faq-qa-header .faq-header').not($(this)).removeClass('faq-category-qa-visible');
                }
                $(this).toggleClass('faq-category-qa-visible');
                $('div.faq-qa-hide').not($(this).parent().next('div.faq-qa-hide')).addClass("collapsed");
                if (!faq_category_hide_qa_accordion) {
                    $(this).parent().next('div.faq-qa-hide').slideToggle('fast', function() {
                        $(this).parent().toggleClass('expanded');
                    });
                }
                $(this).parent().next('div.faq-qa-hide').toggleClass("collapsed");

                // Scroll the page if the collapsed FAQ is not visible.
                // If we have the toolbar so the title may be hidden by the bar.
                var mainScrollTop = Math.max($('html', context).scrollTop(), $('body', context).scrollTop());
                // We compute mainScrollTop because the behaviour is different on FF, IE and CR
                if (mainScrollTop > $(this).offset().top) {
                    $('html, body', context).animate({
                        scrollTop: $(this).offset().top
                    }, 1);
                }

                return false;
            });


            // Show expand all link.
            if (!faq_hide_qa_accordion && !faq_category_hide_qa_accordion) {
                $('#faq-expand-all', context).show();
                $('#faq-expand-all a.faq-expand-all-link', context).show();

                // Add collapse link click event.
                $('#faq-expand-all a.faq-collapse-all-link:not(.faq-processed)', context).addClass('faq-processed').click(function () {
                    $(this).hide();
                    $('#faq-expand-all a.faq-expand-all-link').show();
                    $('div.faq-qa-hide').slideUp('slow', function() {
                        $(this).removeClass('expanded');
                    });
                    $('div.faq-dd-hide-answer').slideUp('slow', function() {
                        $(this).removeClass('expanded');
                    });
                });

                // Add expand link click event.
                $('#faq-expand-all a.faq-expand-all-link:not(.faq-processed)', context).addClass('faq-processed').click(function () {
                    $(this).hide();
                    $('#faq-expand-all a.faq-collapse-all-link').show();
                    $('div.faq-qa-hide').slideDown('slow', function() {
                        $(this).addClass('expanded');
                    });
                    $('div.faq-dd-hide-answer').slideDown('slow', function() {
                        $(this).addClass('expanded');
                    });
                });
            }

            // Handle faq_category_settings_form.
            faq_display_handler();
            questions_top_handler();
            categories_handler();
            teaser_handler();

            $("input[name=faq_display]:not(.faq-processed)", context).addClass('faq-processed').bind("click", faq_display_handler);
            $("input[name=faq_qa_mark]:not(.faq-processed)", context).addClass('faq-processed').bind("click", qa_mark_handler);
            $("input[name=faq_use_teaser]:not(.faq-processed)", context).addClass('faq-processed').bind("click", teaser_handler);
            $("input[name=faq_category_display]:not(.faq-processed)", context).addClass('faq-processed').bind("click", categories_handler);
            $("input[name=faq_hide_child_terms]:not(.faq-processed)", context).addClass('faq-processed').bind("click", child_term_handler);

        }
    };

})(jQuery, Drupal, drupalSettings);
